import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Modality, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

// Increase JSON and urlencoded body limits for PDF uploads and Base64 images
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ limit: '60mb', extended: true }));

// Shared GoogleGenAI client (Server-side only with required User-Agent telemetry)
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Chave GEMINI_API_KEY não configurada no ambiente.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ---------------------------------------------------------
// 1. Analyze Document Endpoint (/api/analyze-document)
// ---------------------------------------------------------
app.post('/api/analyze-document', async (req, res) => {
  try {
    const { text, pdfBase64, filename } = req.body;
    if (!text && !pdfBase64) {
      return res.status(400).json({ error: 'Nenhum documento ou anotação foi fornecido.' });
    }

    const ai = getGenAI();

    const systemPrompt = `Você é um pedagogo e cientista sênior do aplicativo educacional "Minha sala de aula" (Brasil).
Sua missão é analisar meticulosamente o documento fornecido (PDF ou anotações) e extrair a estrutura didática para o aluno.
REGRAS CRÍTICAS:
1. Analise o conteúdo REAL do documento. Se houver figuras ou tabelas descritas/visíveis, inclua sua essência.
2. Identifique de 3 a 5 conceitos fundamentais.
3. Se o documento tiver páginas (PDF), refira-se expressamente às páginas corretas (ex.: "Página 1", "Página 3, Parágrafo 2"). Se for texto sem paginação, refira-se às seções do próprio texto sem inventar números de páginas.
4. Para CADA conceito, defina a representação visual didática mais adequada:
   - 'diagram' (desenho esquemático com legendas precisas, setas, posições astronômicas/geométricas/físicas corretas)
   - 'comparison' (comparação visual estruturada)
   - 'process' (fluxo passo a passo de etapas, entradas e saídas)
   - 'relation_schema' (esquema de relações de causa e efeito ou componentes)
   - 'chart' (gráfico conceitual ou proporções)
5. Crie código SVG completo e válido para cada conceito:
   - viewBox="0 0 800 480"
   - Estilo feito para um quadro verde escolar (#193828): traços brancos (#f8fafc), amarelo suave (#fef08a), azul claro (#93c5fd) e coral (#fda4af).
   - Letras nítidas, textos legíveis (fontSize 14 a 20px), sem textos cortados ou sobrepostos.
   - Precisão científica obrigatória: se for sobre eclipse solar, a Lua deve estar estritamente entre o Sol e a Terra; no eclipse lunar, a Terra entre o Sol e a Lua; sombras se estendendo atrás do corpo oposto à luz; umbra e penumbra nitidamente diferenciadas; órbita inclinada com ângulo e nós; legendas claras.
   - Atribua IDs semânticos aos elementos chave (ex: id="el-sol", id="el-lua", id="el-terra", id="el-umbra", id="el-penumbra").
6. Para cada conceito, elabore uma pergunta aberta instigante para o desafio "Agora eu explico".
7. Retorne EXCLUSIVAMENTE um objeto JSON válido seguindo a estrutura solicitada.`;

    let contents: any;
    if (pdfBase64) {
      contents = {
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: pdfBase64,
            },
          },
          {
            text: `Analise este arquivo PDF "${filename || 'documento.pdf'}" e gere a estrutura didática para "Minha sala de aula". Retorne a resposta em formato JSON.`,
          },
        ],
      };
    } else {
      contents = `Analise o seguinte material de estudos e gere a estrutura didática para "Minha sala de aula":\n\n${text}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Título didático acolhedor do material de estudo' },
            summary: { type: Type.STRING, description: 'Resumo executivo do conteúdo em 2-3 frases para o caderno de estudos' },
            sourceType: { type: Type.STRING, description: '"pdf" ou "notes"' },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  reference: { type: Type.STRING, description: 'Ex: "Página 2" ou "Seção: Mecânica dos Eclipses"' },
                  summary: { type: Type.STRING },
                },
                required: ['id', 'title', 'reference', 'summary'],
              },
            },
            concepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                  pageOrSectionRef: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  keyTakeaway: { type: Type.STRING },
                  representationType: { type: Type.STRING, description: 'diagram, comparison, process, relation_schema, ou chart' },
                  representation: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      questionAnswered: { type: Type.STRING, description: 'Pergunta específica respondida por esta representação' },
                      svgCode: { type: Type.STRING, description: 'Código SVG completo e válido com viewBox="0 0 800 480"' },
                      labels: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            name: { type: Type.STRING },
                            description: { type: Type.STRING },
                            color: { type: Type.STRING },
                          },
                          required: ['id', 'name', 'description'],
                        },
                      },
                      processSteps: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            step: { type: Type.INTEGER },
                            title: { type: Type.STRING },
                            detail: { type: Type.STRING },
                          },
                          required: ['step', 'title', 'detail'],
                        },
                      },
                      comparisonColumns: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            columnTitle: { type: Type.STRING },
                            items: { type: Type.ARRAY, items: { type: Type.STRING } },
                          },
                          required: ['columnTitle', 'items'],
                        },
                      },
                    },
                    required: ['title', 'questionAnswered', 'svgCode', 'labels'],
                  },
                  openQuestion: { type: Type.STRING, description: 'Pergunta aberta instigante para o desafio "Agora eu explico"' },
                  referenceQuotes: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['id', 'title', 'category', 'pageOrSectionRef', 'summary', 'keyTakeaway', 'representationType', 'representation', 'openQuestion'],
              },
            },
          },
          required: ['title', 'summary', 'sections', 'concepts'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Erro ao analisar documento:', error);
    const msg = error?.message || 'Falha ao processar o documento com o modelo Gemini.';
    return res.status(500).json({
      error: 'Não foi possível analisar o documento. Por favor, tente novamente.',
      details: msg,
    });
  }
});

// ---------------------------------------------------------
// 2. Didactic Question & Shortcut Endpoint (/api/explain-question)
// ---------------------------------------------------------
app.post('/api/explain-question', async (req, res) => {
  try {
    const { question, concept, documentContext, shortcutType } = req.body;
    if (!question || !concept) {
      return res.status(400).json({ error: 'Conceito e pergunta são necessários.' });
    }

    const ai = getGenAI();

    let pedagogicalIntent = 'Forneça uma explicação concisa, acolhedora e extremamente didática.';
    if (shortcutType === 'nao_entendi') {
      pedagogicalIntent = 'O aluno não compreendeu esta parte. Desmonte a ideia em analogias simples, passo a passo, sem jargões complexos.';
    } else if (shortcutType === 'outra_maneira') {
      pedagogicalIntent = 'Explique de uma perspectiva completamente nova, usando outro ângulo conceitual ou modelo mental.';
    } else if (shortcutType === 'exemplo_dia_a_dia') {
      pedagogicalIntent = 'Traga um exemplo vívido e prático do cotidiano humano ou observável que ilustre perfeitamente o fenômeno.';
    } else if (shortcutType === 'o_que_acontece_se') {
      pedagogicalIntent = 'Explore um cenário contrafactual ou "e se mudássemos isso?" (ex.: se a órbita não fosse inclinada, se a massa mudasse, etc.) para aprofundar a compreensão da causa e efeito.';
    }

    const prompt = `Você é o tutor da "Minha sala de aula".
Contexto do documento:
${documentContext ? documentContext.slice(0, 3000) : 'Material em estudo'}

Conceito selecionado:
Título: ${concept.title}
Resumo: ${concept.summary}
Representação atual: ${concept.representation?.title || ''} (Responde: ${concept.representation?.questionAnswered || ''})

Pergunta ou comando do aluno: "${question}"
Diretriz didática: ${pedagogicalIntent}

Responda em português do Brasil com calor humano, clareza cirúrgica e rigor científico.
Se uma alteração ou ajuste no desenho SVG do quadro ajudar diretamente na explicação (por exemplo, adicionando uma anotação, destacando um elemento com glow ou demonstrando a nova condição), forneça também o código SVG aprimorado (viewBox="0 0 800 480", paleta de quadro verde #193828 com traços branco, amarelo suave, azul claro e coral).
Identifique também o ID do elemento do quadro a ser destacado (se houver, como 'el-sol', 'el-lua', etc.).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING, description: 'Resposta didática formatada em parágrafos claros' },
            highlightElementId: { type: Type.STRING, description: 'ID do elemento a destacar no SVG, se aplicável' },
            boardAnnotation: { type: Type.STRING, description: 'Pequena frase ou fórmula para giz no quadro' },
            updatedSvgCode: { type: Type.STRING, description: 'Código SVG atualizado caso ilustre melhor a resposta (opcional)' },
          },
          required: ['answer'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Erro ao responder pergunta didática:', error);
    return res.status(500).json({
      error: 'Não foi possível processar a pergunta com o tutor.',
      details: error?.message || 'Erro inesperado.',
    });
  }
});

// ---------------------------------------------------------
// 3. "Agora Eu Explico" Evaluation Endpoint (/api/evaluate-explanation)
// ---------------------------------------------------------
app.post('/api/evaluate-explanation', async (req, res) => {
  try {
    const { concept, studentExplanation, documentContext } = req.body;
    if (!concept || !studentExplanation) {
      return res.status(400).json({ error: 'Conceito e explicação do aluno são necessários.' });
    }

    const ai = getGenAI();

    const prompt = `Você é o avaliador formativo de "Minha sala de aula" (Brasil).
O aluno participou do desafio "Agora eu explico", onde ele responde com suas próprias palavras à pergunta aberta de um conceito.

CONCEITO:
Título: ${concept.title}
Resumo oficial: ${concept.summary}
Pergunta formulada ao aluno: "${concept.openQuestion}"
Contexto do documento original: ${documentContext ? documentContext.slice(0, 3000) : ''}

EXPLICACÃO DO ALUNO:
"${studentExplanation}"

CRITÉRIOS DE AVALIAÇÃO PEDAGÓGICA REAL:
1. Avalie o SIGNIFICADO e a compreeensão conceitual real em relação ao material, sem exigir palavras decoradas ou jargões exatos.
2. Seja justo e construtivo:
   - Identifique com clareza o que o aluno compreendeu CORRETAMENTE (o que ele assimilou bem).
   - Identifique o que FALTOU ou o que ele CONFUNDIU (sem inventar erros que ele não cometeu).
   - Forneça uma CORREÇÃO breve, pontual e muito clara.
3. Não faça elogios vazios automáticos, nem invente equívocos. Foque no progresso real do estudante.
4. Classifique o nível de domínio:
   - 'compreensao_solida': compreendeu o cerne e as relações essenciais.
   - 'em_progresso': compreendeu parte, mas houve lacuna ou pequena confusão conceitual.
   - 'iniciando': faltou o núcleo principal ou houve confusão fundamental.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            masteryLevel: { type: Type.STRING, description: 'compreensao_solida | em_progresso | iniciando' },
            whatUnderstood: { type: Type.STRING, description: 'O que o aluno compreendeu com precisão' },
            whatMissingOrConfused: { type: Type.STRING, description: 'O que faltou ou gerou confusão conceitual' },
            specificCorrection: { type: Type.STRING, description: 'Correção pontual e explicativa' },
            encouragement: { type: Type.STRING, description: 'Mensagem pedagógica acolhedora de próximo passo' },
          },
          required: ['masteryLevel', 'whatUnderstood', 'whatMissingOrConfused', 'specificCorrection', 'encouragement'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Erro na avaliação "Agora eu explico":', error);
    return res.status(500).json({
      error: 'Não foi possível avaliar a explicação.',
      details: error?.message || 'Erro inesperado.',
    });
  }
});

// ---------------------------------------------------------
// 4. Infographic Generation with Nano Banana Pro (gemini-3-pro-image)
// ---------------------------------------------------------
app.post('/api/generate-infographic', async (req, res) => {
  try {
    const { topic, conceptTitle, question, documentContext, customDirection } = req.body;
    const ai = getGenAI();

    // 1. Prepare visual editorial direction using gemini-3.8-flash
    const directionPrompt = `Prepare uma direção visual detalhada em português (pt-BR) para a geração de um infográfico editorial de altíssima qualidade visual com o modelo gemini-3-pro-image (Nano Banana Pro).
Tema: ${topic || conceptTitle}
Conceito: ${conceptTitle}
Dúvida ou objetivo do aluno: ${question || 'Visão completa e didática do conceito'}
Contexto do documento: ${documentContext ? documentContext.slice(0, 2000) : ''}
${customDirection ? `Instrução extra do aluno: ${customDirection}` : ''}

REGRAS VISUAIS DE COMPOSIÇÃO:
- Horizontal 16:9, padrão editorial didático de revista científica de prestígio.
- Uma pergunta principal instigante no topo e um título breve e cativante.
- Uma ilustração central grande e dominante, com posições e relações cientificamente exatas (ex.: se for eclipses, Sol-Lua-Terra ou Sol-Terra-Lua, sombras se estendendo no sentido oposto à luz, umbra e penumbra bem diferenciadas com observadores e o que cada um vê).
- No máximo duas a três seções explicativas bem distribuídas, com legendas legíveis e pouco texto.
- Uma conclusão simples no rodapé (ex.: "O que você vê depende de onde está").
- Se aplicável, nota "Fora de escala".
- Cores harmoniosas, alto contraste, sem sobreposição de textos.

Retorne um prompt descritivo em inglês para o gerador de imagem, detalhando a disposição visual e garantindo a fidelidade didática.`;

    const directionResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: directionPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titlePt: { type: Type.STRING },
            mainQuestionPt: { type: Type.STRING },
            conclusionPt: { type: Type.STRING },
            englishImagePrompt: { type: Type.STRING, description: 'Prompt descritivo completo em inglês para gemini-3-pro-image' },
          },
          required: ['titlePt', 'mainQuestionPt', 'conclusionPt', 'englishImagePrompt'],
        },
      },
    });

    const direction = JSON.parse(directionResponse.text || '{}');

    // 2. Call gemini-3-pro-image with 16:9 aspect ratio and 2K resolution
    const imageResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-image',
      contents: {
        parts: [
          {
            text: `High quality editorial scientific infographic in 16:9 landscape format, 2K resolution. ${direction.englishImagePrompt || `Educational infographic about ${conceptTitle}: clean layout, central scientific illustration, clear Portuguese labels, educational publishing quality.`}`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: '16:9',
          imageSize: '2K',
        },
      },
    });

    let imageUrl = '';
    for (const part of imageResponse.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType ?? 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      throw new Error('Nenhuma imagem foi retornada pelo modelo gemini-3-pro-image.');
    }

    return res.json({
      imageUrl,
      model: 'gemini-3-pro-image (Nano Banana Pro)',
      aspectRatio: '16:9',
      resolution: '2K',
      visualDirection: direction,
    });
  } catch (error: any) {
    console.error('Erro ao gerar infográfico com gemini-3-pro-image:', error);
    const status = error?.status || error?.statusCode || 500;
    const msg = error?.message || '';

    let errorCategory = 'general';
    let userHelp = 'Ocorreu uma falha ao gerar a imagem.';

    if (status === 403 || msg.includes('PERMISSION_DENIED') || msg.includes('API_KEY_INVALID')) {
      errorCategory = 'billing_or_permission';
      userHelp = 'O modelo Nano Banana Pro (gemini-3-pro-image) requer uma chave com faturamento ativado no Google Cloud / AI Studio. Acesse o painel Settings > Secrets para selecionar uma chave válida com acesso aos modelos Pro.';
    } else if (status === 429 || msg.includes('RESOURCE_EXHAUSTED')) {
      errorCategory = 'quota_exhausted';
      userHelp = 'Limite de cota ou taxa atingido para o modelo de imagem de alta resolução. Aguarde alguns instantes ou verifique seu plano de cota no AI Studio.';
    } else if (status === 404 || msg.includes('NOT_FOUND')) {
      errorCategory = 'model_unavailable';
      userHelp = 'O modelo gemini-3-pro-image não está disponível no projeto atual.';
    }

    return res.status(status >= 400 && status < 600 ? status : 500).json({
      error: 'Falha na geração do infográfico',
      category: errorCategory,
      userHelp,
      details: msg,
    });
  }
});

// ---------------------------------------------------------
// 5. Correct/Edit Infographic Endpoint (/api/correct-infographic)
// ---------------------------------------------------------
app.post('/api/correct-infographic', async (req, res) => {
  try {
    const { currentImageData, correctionInstruction, topic } = req.body;
    if (!currentImageData || !correctionInstruction) {
      return res.status(400).json({ error: 'Imagem atual e instrução de correção são necessárias.' });
    }

    const ai = getGenAI();

    // Extract raw base64 data and mime type
    let base64 = currentImageData;
    let mimeType = 'image/png';
    if (currentImageData.includes(';base64,')) {
      const parts = currentImageData.split(';base64,');
      mimeType = parts[0].replace('data:', '');
      base64 = parts[1];
    }

    const promptText = `Modify this educational infographic about "${topic || 'the study topic'}". Keep the overall composition, educational structure, and valid details intact, and apply strictly this specific correction: ${correctionInstruction}. High-resolution editorial scientific infographic, clean Portuguese labels.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64,
              mimeType,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: '16:9',
          imageSize: '2K',
        },
      },
    });

    let updatedImageUrl = '';
    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType ?? 'image/png';
        updatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!updatedImageUrl) {
      throw new Error('Nenhuma imagem modificada foi retornada pelo modelo.');
    }

    return res.json({
      imageUrl: updatedImageUrl,
      model: 'gemini-3-pro-image (Nano Banana Pro)',
      aspectRatio: '16:9',
      resolution: '2K',
    });
  } catch (error: any) {
    console.error('Erro ao corrigir infográfico:', error);
    return res.status(500).json({
      error: 'Não foi possível aplicar a correção ao infográfico.',
      details: error?.message || 'Erro no modelo de edição de imagem.',
    });
  }
});

// ---------------------------------------------------------
// 6. Infographic Scientific Review Endpoint (/api/review-infographic)
// ---------------------------------------------------------
app.post('/api/review-infographic', async (req, res) => {
  try {
    const { imageData, conceptTitle, documentContext } = req.body;
    const ai = getGenAI();

    let base64 = imageData;
    let mimeType = 'image/png';
    if (imageData && imageData.includes(';base64,')) {
      const parts = imageData.split(';base64,');
      mimeType = parts[0].replace('data:', '');
      base64 = parts[1];
    }

    const prompt = `Analise criticamente esta imagem de infográfico gerada para o conceito "${conceptTitle}".
Compare-a com o rigor conceitual do tema e do documento:
Contexto: ${documentContext ? documentContext.slice(0, 2000) : ''}

Faça uma revisão editorial e científica transparente:
- Verifique a coerência científica (ex: se for eclipses, se os corpos celestes estão alinhados na ordem correta, se as sombras se projetam no sentido oposto à luz, se umbra e penumbra estão fiéis).
- Avalie a legibilidade das legendas e ortografia em português.
- Apresente as observações como orientação construtiva para o aluno (nunca como garantia absoluta de precisão).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64,
              mimeType,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scientificCoherence: { type: Type.STRING, description: 'Análise de posições, sombras, processos e fidelidade' },
            labelsAndSpelling: { type: Type.STRING, description: 'Avaliação de clareza textual e legendas' },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Sugestões de melhoria ou pontos de atenção' },
            overallAccuracyNote: { type: Type.STRING, description: 'Nota pedagógica de orientação para o estudante' },
          },
          required: ['scientificCoherence', 'labelsAndSpelling', 'recommendations', 'overallAccuracyNote'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Erro na revisão do infográfico:', error);
    return res.status(500).json({ error: 'Falha ao analisar o infográfico.', details: error?.message });
  }
});

// ---------------------------------------------------------
// 7. Gemini Live Voice Tutor WebSocket Bridge (/api/live-ws)
// ---------------------------------------------------------
const wss = new WebSocketServer({ server, path: '/api/live-ws' });

wss.on('connection', async (clientWs: WebSocket) => {
  let liveSession: any = null;
  let currentContext = {
    documentTitle: 'Geral',
    conceptTitle: 'Introdução',
    conceptSummary: '',
    boardRepresentation: '',
  };

  const cleanup = () => {
    try {
      if (liveSession) {
        liveSession.close();
        liveSession = null;
      }
    } catch (e) {
      // ignore
    }
  };

  clientWs.on('close', cleanup);
  clientWs.on('error', cleanup);

  try {
    const ai = getGenAI();

    // Configure tools available to the Live Tutor:
    const updateBoardDeclaration = {
      name: 'updateBoard',
      description: 'Atualiza o quadro didático escolar com uma nova explicação, destaque ou anotação conceitual para o aluno.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          conceptId: { type: Type.STRING, description: 'ID do conceito atual' },
          chalkboardAnnotation: { type: Type.STRING, description: 'Texto curto em giz para colocar no quadro' },
          explanation: { type: Type.STRING, description: 'Explicação falada correspondente' },
        },
        required: ['conceptId', 'explanation'],
      },
    };

    const highlightElementDeclaration = {
      name: 'highlightBoardElement',
      description: 'Destaca visualmente um elemento específico desenhado no quadro (ex.: sol, lua, terra, umbra, penumbra, tilacoide, estroma, etc.) enquanto fala sobre ele.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          elementId: { type: Type.STRING, description: 'Identificador do elemento no quadro' },
          reason: { type: Type.STRING, description: 'Motivo do destaque didático' },
        },
        required: ['elementId', 'reason'],
      },
    };

    const createInfographicDeclaration = {
      name: 'createInfographic',
      description: 'Aciona a geração de um infográfico editorial didático de alta resolução com Nano Banana Pro quando o aluno pede um infográfico ou resumo visual completo.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING, description: 'Tema do infográfico' },
          focus: { type: Type.STRING, description: 'Foco didático específico' },
        },
        required: ['topic'],
      },
    };

    const buildSystemInstruction = () => `Você é o tutor de voz de "Minha sala de aula", um professor acolhedor, vibrante e didático no Brasil.
Você fala exclusivamente em português do Brasil com naturalidade, clareza e ritmo pausado para aprendizagem.
CONTEXTO ATUAL DE ESTUDO:
- Documento: "${currentContext.documentTitle}"
- Conceito selecionado no quadro: "${currentContext.conceptTitle}"
- Resumo do conceito: "${currentContext.conceptSummary}"
- O que está desenhado no quadro verde: "${currentContext.boardRepresentation}"

DIRETRIZES DA CONVERSA:
1. Suas respostas devem ser breves (2 a 4 frases por turno de fala), acessíveis e adaptadas ao nível do aluno. Não dê palestras longas sem pausas.
2. Você sabe exatamente o que está desenhado no quadro verde à frente do aluno. Faça referências aos elementos visuais (ex: "Veja ali no desenho a região mais escura atrás da Lua...").
3. Use a ferramenta "highlightBoardElement" para destacar elementos no quadro quando for explicá-los.
4. Se o aluno pedir para alterar o quadro ou desenhar algo novo, chame "updateBoard".
5. Se o aluno pedir por voz para "criar um infográfico", acione "createInfographic".
6. Nunca anuncie que alterou um desenho antes de chamar a ferramenta correspondente.`;

    // Connect to real Gemini Live API using gemini-3.8-live
    liveSession = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: 'Aoede', // Warm, clear pedagogical voice
            },
          },
        },
        systemInstruction: buildSystemInstruction(),
        tools: [
          {
            functionDeclarations: [
              updateBoardDeclaration,
              highlightElementDeclaration,
              createInfographicDeclaration,
            ],
          },
        ],
      },
      callbacks: {
        onmessage: async (message: any) => {
          // 1. Audio stream from model (24kHz PCM)
          for (const part of message.serverContent?.modelTurn?.parts ?? []) {
            if (part.inlineData?.data) {
              clientWs.send(
                JSON.stringify({
                  type: 'audio',
                  audio: part.inlineData.data,
                })
              );
            }
          }

          // 2. Transcription
          if (message.serverContent?.outputAudioTranscription?.text) {
            clientWs.send(
              JSON.stringify({
                type: 'transcription',
                role: 'tutor',
                text: message.serverContent.outputAudioTranscription.text,
              })
            );
          }
          if (message.serverContent?.inputAudioTranscription?.text) {
            clientWs.send(
              JSON.stringify({
                type: 'transcription',
                role: 'user',
                text: message.serverContent.inputAudioTranscription.text,
              })
            );
          }

          // 3. User interrupted model speech
          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ type: 'interrupted' }));
          }

          // 4. Function/Tool calls from Live tutor
          if (message.toolCall?.functionCalls) {
            for (const call of message.toolCall.functionCalls) {
              console.log('Gemini Live tool call:', call.name, call.args);

              // Inform client browser to execute UI action
              clientWs.send(
                JSON.stringify({
                  type: 'tool_call',
                  name: call.name,
                  args: call.args,
                  callId: call.id,
                })
              );

              // Return tool response to Gemini Live so it continues conversation
              if (liveSession) {
                try {
                  await liveSession.sendToolResponse({
                    functionResponses: [
                      {
                        id: call.id,
                        name: call.name,
                        response: {
                          status: 'success',
                          executed: true,
                          message: `Ação "${call.name}" realizada com sucesso no quadro do aluno.`,
                        },
                      },
                    ],
                  });
                } catch (err) {
                  console.error('Erro ao enviar resposta de tool para Gemini Live:', err);
                }
              }
            }
          }
        },
        onerror: (err: any) => {
          console.error('Erro na sessão Gemini Live:', err);
          clientWs.send(
            JSON.stringify({
              type: 'error',
              message: err?.message || 'Falha na conexão de voz com o tutor.',
            })
          );
        },
        onclose: () => {
          clientWs.send(JSON.stringify({ type: 'session_closed' }));
        },
      },
    });

    clientWs.send(JSON.stringify({ type: 'connected' }));

    // Handle incoming client messages
    clientWs.on('message', async (data: any) => {
      try {
        const payload = JSON.parse(data.toString());

        if (payload.type === 'audio' && payload.audio) {
          // Send 16kHz PCM audio chunk to Live session
          if (liveSession) {
            await liveSession.sendRealtimeInput({
              audio: {
                data: payload.audio,
                mimeType: 'audio/pcm;rate=16000',
              },
            });
          }
        } else if (payload.type === 'context_update') {
          // Update active concept context
          currentContext = {
            documentTitle: payload.documentTitle || currentContext.documentTitle,
            conceptTitle: payload.conceptTitle || currentContext.conceptTitle,
            conceptSummary: payload.conceptSummary || currentContext.conceptSummary,
            boardRepresentation: payload.boardRepresentation || currentContext.boardRepresentation,
          };

          // Inform Live model of concept change
          if (liveSession) {
            await liveSession.sendRealtimeInput({
              text: `[SISTEMA DE SALA DE AULA]: O aluno acabou de selecionar o conceito "${currentContext.conceptTitle}". Descrição: ${currentContext.conceptSummary}. Quadro atual: ${currentContext.boardRepresentation}. Dê as boas-vindas a esta etapa em 1 ou 2 frases didáticas se o aluno iniciar uma conversa.`,
            });
          }
        } else if (payload.type === 'text_question' && payload.text) {
          if (liveSession) {
            await liveSession.sendRealtimeInput({
              text: payload.text,
            });
          }
        }
      } catch (err) {
        console.error('Erro ao processar mensagem do cliente WS:', err);
      }
    });
  } catch (err: any) {
    console.error('Erro ao iniciar Gemini Live:', err);
    clientWs.send(
      JSON.stringify({
        type: 'error',
        message: err?.message || 'Não foi possível conectar ao Gemini Live.',
      })
    );
  }
});

// ---------------------------------------------------------
// Vite Middleware / Static Serving
// ---------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = 3000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Minha sala de aula rodando em http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Falha ao iniciar o servidor:', err);
  process.exit(1);
});
