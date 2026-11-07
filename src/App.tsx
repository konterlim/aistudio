import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SAMPLE_MATERIALS } from './data/sampleMaterials';
import { DocumentData, Concept, LiveStatus, EvaluationResult, InfographicData } from './types/classroom';
import { Chalkboard } from './components/Chalkboard';
import { Notebook } from './components/Notebook';
import { TutorVoiceBar } from './components/TutorVoiceBar';
import { AgoraEuExplicoModal } from './components/AgoraEuExplicoModal';
import { InfographicModal } from './components/InfographicModal';
import { OriginalNotesModal } from './components/OriginalNotesModal';
import { DocumentSelectorModal } from './components/DocumentSelectorModal';
import { LiveAudioPlayer, LiveAudioRecorder } from './utils/audioStreamer';

export default function App() {
  // 1. Document & Concept State (Defaults to celestial mechanics sample)
  const [currentDocument, setCurrentDocument] = useState<DocumentData>(SAMPLE_MATERIALS[0]);
  const [selectedConcept, setSelectedConcept] = useState<Concept>(SAMPLE_MATERIALS[0].concepts[0]);

  // 2. Blackboard & Didactic Question State
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);
  const [liveToolHighlightId, setLiveToolHighlightId] = useState<string | null>(null);
  const [liveToolNote, setLiveToolNote] = useState<string | null>(null);
  const [tutorAnswer, setTutorAnswer] = useState<{
    answer: string;
    boardAnnotation?: string;
    highlightElementId?: string;
    updatedSvgCode?: string;
  } | null>(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);

  // 3. Gemini Live Real Voice Session State
  const [liveStatus, setLiveStatus] = useState<LiveStatus>('disconnected');
  const [isLiveMuted, setIsLiveMuted] = useState(false);
  const [liveErrorMessage, setLiveErrorMessage] = useState<string | null>(null);
  const [transcriptHistory, setTranscriptHistory] = useState<
    Array<{ role: 'user' | 'tutor' | 'system'; text: string }>
  >([]);

  // 4. Modals State
  const [isAgoraEuExplicoOpen, setIsAgoraEuExplicoOpen] = useState(false);
  const [isInfographicModalOpen, setIsInfographicModalOpen] = useState(false);
  const [isOriginalNotesOpen, setIsOriginalNotesOpen] = useState(false);
  const [isDocSelectorOpen, setIsDocSelectorOpen] = useState(false);

  // 5. Infographic (Nano Banana Pro) State
  const [infographicData, setInfographicData] = useState<InfographicData | null>(null);
  const [isGeneratingInfographic, setIsGeneratingInfographic] = useState(false);
  const [infographicError, setInfographicError] = useState<{
    error: string;
    category?: string;
    userHelp?: string;
    details?: string;
  } | null>(null);

  // 6. Document Analysis State
  const [isAnalyzingDocument, setIsAnalyzingDocument] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Refs for audio and websocket
  const wsRef = useRef<WebSocket | null>(null);
  const playerRef = useRef<LiveAudioPlayer | null>(null);
  const recorderRef = useRef<LiveAudioRecorder | null>(null);

  // Cleanup audio and websocket on unmount
  useEffect(() => {
    return () => {
      if (recorderRef.current) recorderRef.current.stop();
      if (playerRef.current) playerRef.current.close();
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // Update tutor context whenever selected concept changes
  const handleSelectConcept = useCallback((concept: Concept) => {
    setSelectedConcept(concept);
    setActiveHighlightId(null);
    setLiveToolHighlightId(null);
    setLiveToolNote(null);
    setTutorAnswer(null);

    // Notify Gemini Live session over WebSocket if connected
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'context_update',
          documentTitle: currentDocument.title,
          conceptTitle: concept.title,
          conceptSummary: concept.summary,
          boardRepresentation: concept.representation.title,
        })
      );
    }
  }, [currentDocument.title]);

  // Handle didactic question / shortcuts below the blackboard
  const handleAskQuestion = async (question: string, shortcutType?: string) => {
    setIsLoadingQuestion(true);
    try {
      const response = await fetch('/api/explain-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          concept: selectedConcept,
          documentContext: currentDocument.originalContent || currentDocument.summary,
          shortcutType,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao obter resposta do tutor.');
      }

      const data = await response.json();
      setTutorAnswer(data);
      if (data.highlightElementId) {
        setActiveHighlightId(data.highlightElementId);
      }

      // Also append to conversation transcript
      setTranscriptHistory((prev) => [
        ...prev,
        { role: 'user', text: question },
        { role: 'tutor', text: data.answer },
      ]);
    } catch (err: any) {
      console.error('Erro na pergunta didática:', err);
      setTutorAnswer({
        answer: 'Desculpe, ocorreu uma oscilação na conexão com o tutor. Por favor, tente perguntar novamente.',
      });
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  // -------------------------------------------------------------
  // Gemini Live Voice Session Management
  // -------------------------------------------------------------
  const startLiveSession = async () => {
    setLiveStatus('connecting');
    setLiveErrorMessage(null);

    try {
      // 1. Initialize Player to satisfy browser audio gesture requirements
      if (!playerRef.current) {
        playerRef.current = new LiveAudioPlayer();
      }
      await playerRef.current.init();

      // 2. Open WebSocket connection to /api/live-ws
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live-ws`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        // Send initial context to the tutor
        ws.send(
          JSON.stringify({
            type: 'context_update',
            documentTitle: currentDocument.title,
            conceptTitle: selectedConcept.title,
            conceptSummary: selectedConcept.summary,
            boardRepresentation: selectedConcept.representation.title,
          })
        );

        // 3. Start microphone capture (16kHz PCM)
        recorderRef.current = new LiveAudioRecorder((base64Audio) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'audio', audio: base64Audio }));
          }
        });
        await recorderRef.current.start();
        setLiveStatus('listening');

        setTranscriptHistory((prev) => [
          ...prev,
          { role: 'system', text: `Sessão iniciada com o tutor sobre "${selectedConcept.title}".` },
        ]);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'audio' && msg.audio) {
            setLiveStatus('speaking');
            playerRef.current?.playChunk(msg.audio);
          } else if (msg.type === 'interrupted') {
            playerRef.current?.stopAll();
            setLiveStatus('listening');
          } else if (msg.type === 'transcription') {
            setTranscriptHistory((prev) => [
              ...prev,
              { role: msg.role === 'tutor' ? 'tutor' : 'user', text: msg.text },
            ]);
            if (msg.role === 'user') {
              setLiveStatus('listening');
            }
          } else if (msg.type === 'tool_call') {
            handleLiveToolCall(msg.name, msg.args);
          } else if (msg.type === 'error') {
            setLiveErrorMessage(msg.message);
            setLiveStatus('error');
          }
        } catch (e) {
          console.error('Erro ao processar mensagem Live:', e);
        }
      };

      ws.onerror = (e) => {
        console.error('Erro de conexão WebSocket Live:', e);
        setLiveErrorMessage('Erro ao conectar ao tutor de voz.');
        setLiveStatus('error');
      };

      ws.onclose = () => {
        setLiveStatus('disconnected');
        recorderRef.current?.stop();
      };
    } catch (err: any) {
      console.error('Falha ao iniciar Live Session:', err);
      setLiveErrorMessage(
        err?.message?.includes('Permission')
          ? 'Permissão de microfone negada no navegador. Por favor, autorize o microfone.'
          : err?.message || 'Falha ao iniciar sessão de voz.'
      );
      setLiveStatus('error');
      if (recorderRef.current) recorderRef.current.stop();
    }
  };

  const endLiveSession = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
    if (playerRef.current) {
      playerRef.current.stopAll();
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setLiveStatus('disconnected');
    setTranscriptHistory((prev) => [
      ...prev,
      { role: 'system', text: 'Sessão de voz com o tutor finalizada.' },
    ]);
  };

  const toggleLiveMute = () => {
    const nextMuted = !isLiveMuted;
    setIsLiveMuted(nextMuted);
    recorderRef.current?.setMuted(nextMuted);
    playerRef.current?.setMuted(nextMuted);
  };

  // Handle Tool Calls made by Gemini Live during speech
  const handleLiveToolCall = (toolName: string, args: any) => {
    if (toolName === 'highlightBoardElement') {
      const elementId = args.elementId;
      setLiveToolHighlightId(elementId);
      setLiveToolNote(args.reason || 'Elemento em destaque');
      // Auto clear note after 10 seconds
      setTimeout(() => {
        setLiveToolNote(null);
      }, 10000);
    } else if (toolName === 'updateBoard') {
      setTutorAnswer((prev) => ({
        answer: args.explanation || prev?.answer || '',
        boardAnnotation: args.chalkboardAnnotation,
        highlightElementId: args.conceptId,
      }));
    } else if (toolName === 'createInfographic') {
      // Open infographic modal and generate
      setIsInfographicModalOpen(true);
      generateInfographic(args.focus);
    }
  };

  // -------------------------------------------------------------
  // "Agora Eu Explico" Formative Evaluation
  // -------------------------------------------------------------
  const handleEvaluateExplanation = async (studentExplanation: string): Promise<EvaluationResult> => {
    const response = await fetch('/api/evaluate-explanation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        concept: selectedConcept,
        studentExplanation,
        documentContext: currentDocument.originalContent || currentDocument.summary,
      }),
    });

    if (!response.ok) {
      throw new Error('Falha ao avaliar a explicação com o professor.');
    }

    const data: EvaluationResult = await response.json();
    return data;
  };

  // -------------------------------------------------------------
  // Infographic Generation (gemini-3-pro-image / Nano Banana Pro)
  // -------------------------------------------------------------
  const generateInfographic = async (customDirection?: string) => {
    setIsGeneratingInfographic(true);
    setInfographicError(null);

    try {
      const response = await fetch('/api/generate-infographic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: currentDocument.title,
          conceptTitle: selectedConcept.title,
          question: selectedConcept.representation.questionAnswered,
          documentContext: currentDocument.originalContent || currentDocument.summary,
          customDirection,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setInfographicError({
          error: data.error || 'Erro ao gerar o infográfico.',
          category: data.category,
          userHelp: data.userHelp,
          details: data.details,
        });
        return;
      }

      setInfographicData({
        imageUrl: data.imageUrl,
        topic: currentDocument.title,
        conceptTitle: selectedConcept.title,
        model: data.model,
        aspectRatio: data.aspectRatio,
        resolution: data.resolution,
        visualDirection: data.visualDirection,
      });
    } catch (err: any) {
      setInfographicError({
        error: 'Erro de conexão ao solicitar a imagem.',
        details: err?.message,
      });
    } finally {
      setIsGeneratingInfographic(false);
    }
  };

  const handleCorrectInfographic = async (correctionInstruction: string) => {
    if (!infographicData?.imageUrl) return;

    try {
      const response = await fetch('/api/correct-infographic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentImageData: infographicData.imageUrl,
          correctionInstruction,
          topic: currentDocument.title,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Falha ao corrigir o infográfico.');
        return;
      }

      setInfographicData((prev) =>
        prev
          ? {
              ...prev,
              imageUrl: data.imageUrl,
            }
          : null
      );
    } catch (err: any) {
      alert(`Erro ao enviar correção: ${err?.message}`);
    }
  };

  const handleReviewInfographic = async () => {
    if (!infographicData?.imageUrl) return;

    const response = await fetch('/api/review-infographic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageData: infographicData.imageUrl,
        conceptTitle: selectedConcept.title,
        documentContext: currentDocument.originalContent || currentDocument.summary,
      }),
    });

    if (!response.ok) {
      alert('Falha ao gerar revisão científica.');
      return;
    }

    const review = await response.json();
    setInfographicData((prev) => (prev ? { ...prev, review } : null));
  };

  const handleAskTutorAboutInfographic = () => {
    if (!infographicData) return;
    setIsInfographicModalOpen(false);

    // Provide context to Live tutor
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'text_question',
          text: `[ALUNO MOSTROU O INFOGRÁFICO GERADO]: O aluno está visualizando o infográfico gerado em 16:9 sobre "${infographicData.conceptTitle}". Direção: "${infographicData.visualDirection?.mainQuestionPt || ''}". Responda em 1 ou 2 frases sobre os destaques visuais deste infográfico.`,
        })
      );
    }

    setTranscriptHistory((prev) => [
      ...prev,
      {
        role: 'user',
        text: `Tutor, analise comigo o infográfico gerado sobre "${infographicData.conceptTitle}".`,
      },
    ]);
  };

  // -------------------------------------------------------------
  // Document Upload and Analysis
  // -------------------------------------------------------------
  const handleAnalyzeNewDocument = async (payload: {
    text?: string;
    pdfBase64?: string;
    filename?: string;
  }) => {
    setIsAnalyzingDocument(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Não foi possível analisar o documento.');
      }

      // Reset study context when changing document
      endLiveSession();
      setInfographicData(null);
      setTutorAnswer(null);
      setActiveHighlightId(null);
      setLiveToolHighlightId(null);

      const newDoc: DocumentData = {
        id: `user-doc-${Date.now()}`,
        title: data.title || payload.filename || 'Material de Estudo',
        summary: data.summary || 'Resumo do documento analisado.',
        sourceType: payload.pdfBase64 ? 'pdf' : 'notes',
        sourceName: payload.filename || 'Anotações do Aluno',
        originalContent: payload.text || 'Documento PDF com páginas e figuras analisadas.',
        sections: data.sections || [],
        concepts: data.concepts || [],
      };

      setCurrentDocument(newDoc);
      if (newDoc.concepts.length > 0) {
        setSelectedConcept(newDoc.concepts[0]);
      }
      setIsDocSelectorOpen(false);
    } catch (err: any) {
      setAnalysisError(err?.message || 'Falha na análise do material.');
    } finally {
      setIsAnalyzingDocument(false);
    }
  };

  const handleStartWithSample = (sample: DocumentData) => {
    endLiveSession();
    setInfographicData(null);
    setTutorAnswer(null);
    setActiveHighlightId(null);
    setLiveToolHighlightId(null);

    setCurrentDocument(sample);
    setSelectedConcept(sample.concepts[0]);
    setIsDocSelectorOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fcfaf4] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-200">
      {/* 1. Barra Superior Fixada do Tutor Gemini Live */}
      <TutorVoiceBar
        status={liveStatus}
        isMuted={isLiveMuted}
        errorMessage={liveErrorMessage}
        onStartSession={startLiveSession}
        onEndSession={endLiveSession}
        onToggleMute={toggleLiveMute}
        onRetry={startLiveSession}
        transcriptHistory={transcriptHistory}
        activeConceptTitle={selectedConcept.title}
      />

      {/* 2. Área Central da Sala de Aula: Quadro Verde Didático + Caderno de Estudos à Direita */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col lg:flex-row gap-5">
        {/* Espaço Principal: O Grande Quadro Verde Escolar */}
        <div className="flex-1 min-h-[580px] flex flex-col">
          <Chalkboard
            concept={selectedConcept}
            onAskQuestion={handleAskQuestion}
            isLoadingQuestion={isLoadingQuestion}
            tutorAnswer={tutorAnswer}
            onApplySvgUpdate={(newSvg) => {
              // Update concept svg in memory
              setSelectedConcept((prev) => ({
                ...prev,
                representation: {
                  ...prev.representation,
                  svgCode: newSvg,
                },
              }));
            }}
            activeHighlightId={activeHighlightId}
            onSelectHighlight={(id) => {
              setActiveHighlightId(id);
              setLiveToolHighlightId(null);
            }}
            liveToolHighlightId={liveToolHighlightId}
            liveToolNote={liveToolNote}
          />
        </div>

        {/* Caderno de Estudos à Direita com Lista de Conceitos e Ações */}
        <Notebook
          document={currentDocument}
          selectedConceptId={selectedConcept.id}
          onSelectConcept={handleSelectConcept}
          onOpenOriginalNotes={() => setIsOriginalNotesOpen(true)}
          onChangeMaterial={() => setIsDocSelectorOpen(true)}
          onOpenAgoraEuExplico={() => setIsAgoraEuExplicoOpen(true)}
          onOpenInfographicModal={() => {
            setIsInfographicModalOpen(true);
            if (!infographicData && !isGeneratingInfographic) {
              generateInfographic();
            }
          }}
          isGeneratingInfographic={isGeneratingInfographic}
        />
      </main>

      {/* 3. Modal: Desafio "Agora Eu Explico" (Avaliação Formativa Real) */}
      <AgoraEuExplicoModal
        isOpen={isAgoraEuExplicoOpen}
        onClose={() => setIsAgoraEuExplicoOpen(false)}
        concept={selectedConcept}
        documentContext={currentDocument.originalContent || currentDocument.summary}
        onEvaluate={handleEvaluateExplanation}
      />

      {/* 4. Modal: Infográfico com Nano Banana Pro (gemini-3-pro-image) */}
      <InfographicModal
        isOpen={isInfographicModalOpen}
        onClose={() => setIsInfographicModalOpen(false)}
        infographic={infographicData}
        isLoading={isGeneratingInfographic}
        errorInfo={infographicError}
        onGenerate={generateInfographic}
        onCorrect={handleCorrectInfographic}
        onReview={handleReviewInfographic}
        onAskTutorAboutImage={handleAskTutorAboutInfographic}
        activeTopic={currentDocument.title}
      />

      {/* 5. Modal: Ver Anotações Originais */}
      <OriginalNotesModal
        isOpen={isOriginalNotesOpen}
        onClose={() => setIsOriginalNotesOpen(false)}
        document={currentDocument}
      />

      {/* 6. Modal: Seletor de Documentos (Upload PDF / Colar Anotações / Exemplos) */}
      <DocumentSelectorModal
        isOpen={isDocSelectorOpen}
        onClose={() => setIsDocSelectorOpen(false)}
        canClose={true}
        onStartWithSample={handleStartWithSample}
        onAnalyzeNewDocument={handleAnalyzeNewDocument}
        isAnalyzing={isAnalyzingDocument}
        analysisError={analysisError}
      />
    </div>
  );
}
