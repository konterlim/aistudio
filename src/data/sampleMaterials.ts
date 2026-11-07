import { DocumentData } from '../types/classroom';

export const SAMPLE_MATERIALS: DocumentData[] = [
  {
    id: 'sample-eclipses',
    title: 'Eclipses Solares e Lunares: Óptica Celeste, Cones de Sombra e Órbitas',
    summary: 'Estudo aprofundado da mecânica celeste dos eclipses, geometria da formação de umbra e penumbra, alinhamento dos corpos celestes e a influência da inclinação orbital lunar de 5 graus.',
    sourceType: 'sample',
    sourceName: 'Material Pedagógico de Exemplo: Astronomia e Óptica',
    originalContent: `ECLIPSES SOLARES E LUNARES: MECÂNICA CELESTE E FORMAÇÃO DE SOMBRAS
1. INTRODUÇÃO À MECÂNICA CELESTE
Um eclipse é o obscurecimento total ou parcial de um astro pela passagem de outro corpo celeste entre ele e o observador, ou pela entrada do astro no cone de sombra projetado por outro. O sistema Sol-Terra-Lua produz dois tipos principais de eclipses: solares e lunares.

2. ECLIPSE SOLAR: ALINHAMENTO SOL-LUA-TERRA
No eclipse solar, a Lua posiciona-se exatamente entre o Sol e a Terra (ordem estrita: Sol -> Lua -> Terra), ocorrendo exclusivamente na fase de Lua Nova. Por ser uma fonte de luz extensa, o Sol gera atrás da Lua duas zonas de sombra bem distintas projetadas na direção oposta à fonte luminosa:
- Umbra: região cônica de sombra total onde todo o disco solar é bloqueado pela Lua. Na superfície da Terra, a ponta deste cone atinge uma faixa estreita (faixa de totalidade), de no máximo 270 km de largura, onde os observadores testemunham um eclipse solar total e o aparecimento da coroa solar.
- Penumbra: região de sombra parcial ao redor da umbra, onde apenas uma fração do disco solar é ocultada. Os observadores nessa região vêem um eclipse solar parcial.

3. ECLIPSE LUNAR: ALINHAMENTO SOL-TERRA-LUA
No eclipse lunar, a Terra posiciona-se exatamente entre o Sol e a Lua (ordem estrita: Sol -> Terra -> Lua), ocorrendo exclusivamente na fase de Lua Cheia. Como a Terra é muito maior que a Lua (diâmetro aproximadamente 3,7 vezes maior), o cone de umbra terrestre projeta-se por cerca de 1,4 milhão de quilômetros no espaço.
Quando a Lua entra completamente na umbra terrestre, ocorre o eclipse lunar total. A Lua não fica totalmente invisível, mas adquire uma coloração avermelhada ("Lua de Sangue"), decorrente da refração e dispersão da luz solar pela atmosfera da Terra (dispersão de Rayleigh), que filtra comprimentos de onda azuis e desvia os raios vermelhos para o interior do cone de sombra.

4. UMBRA E PENUMBRA: GEOMETRIA DA FONTE EXTENSA
A formação simultânea de umbra e penumbra é consequência direta do diâmetro angular finito do Sol. As retas tangentes externas que partem dos bordos solares e tangenciam a Lua definem os limites da umbra; já as retas tangentes cruzadas definem os limites de expansão da penumbra.
- Umbra: cone convergente escuro, zero fótons diretos do Sol.
- Penumbra: cone divergente gradual, iluminação decrescente da borda externa para o centro.

5. A INCLINAÇÃO ORBITAL DE 5° E A LINHA DOS NÓS
Se o plano orbital da Lua coincidisse perfeitamente com o plano da eclíptica (plano orbital da Terra em torno do Sol), teríamos dois eclipses todos os meses: um solar a cada Lua Nova e um lunar a cada Lua Cheia.
No entanto, o plano orbital da Lua possui uma inclinação de aproximadamente 5°09' em relação à eclíptica. Os dois planos interceptam-se ao longo de uma reta imaginária denominada "Linha dos Nós". Eclipses só ocorrem quando a Lua Nova ou Cheia coincide com a passagem da Lua próxima a um desses nós (nó ascendente ou nó descendente). Nas demais fases, a sombra da Lua passa "por cima" ou "por baixo" da Terra no espaço tridimensional.`,
    sections: [
      { id: 'sec-1', title: '1. Mecânica dos Eclipses Solares', reference: 'Seção 2: Alinhamento Sol-Lua-Terra', summary: 'Ordem Sol-Lua-Terra, fase de Lua Nova, projeção da sombra lunar sobre a superfície terrestre.' },
      { id: 'sec-2', title: '2. Mecânica dos Eclipses Lunares', reference: 'Seção 3: Alinhamento Sol-Terra-Lua', summary: 'Ordem Sol-Terra-Lua, fase de Lua Cheia, dispersão de Rayleigh e coloração avermelhada.' },
      { id: 'sec-3', title: '3. Óptica Geométrica: Umbra e Penumbra', reference: 'Seção 4: Geometria da Fonte Extensa', summary: 'Raios tangentes externos e cruzados de fonte extensa determinando zonas de escuridão total e parcial.' },
      { id: 'sec-4', title: '4. Inclinação Orbital de 5° e a Linha dos Nós', reference: 'Seção 5: Por que não ocorrem todo mês', summary: 'Desalinhamento entre o plano da órbita lunar e o plano da eclíptica da Terra.' },
    ],
    concepts: [
      {
        id: 'c-eclipse-solar',
        title: 'Eclipse Solar: Alinhamento Sol — Lua — Terra',
        category: 'Geometria Celeste',
        pageOrSectionRef: 'Seção 2: Alinhamento Sol-Lua-Terra',
        summary: 'A Lua posiciona-se entre o Sol e a Terra durante a Lua Nova, projetando seu cone de sombra sobre a superfície terrestre.',
        keyTakeaway: 'Ordem rigorosa: Sol -> Lua -> Terra. A umbra gera eclipse total em uma faixa estreita; a penumbra gera eclipse parcial.',
        representationType: 'diagram',
        representation: {
          title: 'Diagrama Óptico: Projeção de Sombra no Eclipse Solar',
          questionAnswered: 'Qual é a posição exata dos corpos celestes e como as sombras da Lua atingem a Terra?',
          svgCode: `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <!-- Gradiente de emissão solar -->
    <radialGradient id="solGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fffbeb" stop-opacity="1" />
      <stop offset="60%" stop-color="#fef08a" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#eab308" stop-opacity="0.2" />
    </radialGradient>
    <!-- Penumbra suave -->
    <linearGradient id="penumbraGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#93c5fd" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#93c5fd" stop-opacity="0.08" />
    </linearGradient>
    <!-- Marcador de seta giz -->
    <marker id="chalkArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#fef08a" />
    </marker>
    <marker id="chalkArrowBlue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#93c5fd" />
    </marker>
  </defs>

  <!-- Grade sutil de quadro escolar -->
  <line x1="40" y1="240" x2="760" y2="240" stroke="#f8fafc" stroke-width="1" stroke-dasharray="4,6" opacity="0.25" />
  <text x="50" y="38" fill="#fef08a" font-family="'Caveat', cursive, sans-serif" font-size="24" font-weight="bold">ORDEM OBRIGATÓRIA: SOL → LUA → TERRA (LUA NOVA)</text>
  <text x="50" y="62" fill="#93c5fd" font-size="13" font-family="sans-serif">Fonte de luz extensa: os cones de sombra se projetam atrás da Lua na direção oposta ao Sol</text>

  <!-- Raios de Penumbra (externos cruzados) -->
  <polygon points="120,160 380,230 630,175 630,305 380,250 120,320" fill="url(#penumbraGrad)" />

  <!-- Cone de Umbra (escuro total) -->
  <polygon points="380,232 630,238 630,242 380,248" fill="#0f172a" stroke="#fda4af" stroke-width="1.2" stroke-dasharray="3,3" />

  <!-- Raios de luz limites (linhas de giz branco tracejado) -->
  <!-- Tangente externa superior: Sol topo para Lua topo -->
  <line x1="120" y1="160" x2="630" y2="238" stroke="#fef08a" stroke-width="1.2" opacity="0.6" />
  <!-- Tangente externa inferior: Sol base para Lua base -->
  <line x1="120" y1="320" x2="630" y2="242" stroke="#fef08a" stroke-width="1.2" opacity="0.6" />
  <!-- Tangente cruzada superior: Sol topo para Lua base -->
  <line x1="120" y1="160" x2="630" y2="305" stroke="#93c5fd" stroke-width="1" stroke-dasharray="3,3" opacity="0.7" />
  <!-- Tangente cruzada inferior: Sol base para Lua topo -->
  <line x1="120" y1="320" x2="630" y2="175" stroke="#93c5fd" stroke-width="1" stroke-dasharray="3,3" opacity="0.7" />

  <!-- 1. SOL (à esquerda) -->
  <g id="el-sol" class="cursor-pointer transition-transform duration-200 hover:scale-105">
    <circle cx="120" cy="240" r="75" fill="url(#solGlow)" stroke="#fef08a" stroke-width="2.5" />
    <!-- Raios estilizados de giz ao redor do Sol -->
    <path d="M 120 150 L 120 135 M 120 330 L 120 345 M 30 240 L 15 240 M 210 240 L 225 240 M 55 175 L 45 165 M 185 305 L 195 315 M 55 305 L 45 315 M 185 175 L 195 165" stroke="#fef08a" stroke-width="2" stroke-linecap="round" />
    <text x="120" y="246" text-anchor="middle" fill="#1c1917" font-size="18" font-weight="bold">SOL</text>
    <text x="120" y="380" text-anchor="middle" fill="#fef08a" font-size="14" font-weight="600">Fonte Extensa</text>
  </g>

  <!-- 2. LUA (no centro - bloqueando a luz) -->
  <g id="el-lua" class="cursor-pointer transition-transform duration-200 hover:scale-105">
    <!-- Linha de órbita tracejada -->
    <path d="M 380 140 Q 400 240 380 340" fill="none" stroke="#f8fafc" stroke-width="1.2" stroke-dasharray="4,4" opacity="0.5" />
    <circle cx="380" cy="240" r="16" fill="#64748b" stroke="#f8fafc" stroke-width="1.5" />
    <!-- Lado iluminado voltado para o Sol -->
    <path d="M 380 224 A 16 16 0 0 0 380 256 Z" fill="#e2e8f0" />
    <text x="380" y="210" text-anchor="middle" fill="#f8fafc" font-size="16" font-weight="bold">LUA</text>
    <text x="380" y="280" text-anchor="middle" fill="#f8fafc" font-size="12" opacity="0.9">Nova (no meio)</text>
  </g>

  <!-- 3. TERRA (à direita) -->
  <g id="el-terra" class="cursor-pointer transition-transform duration-200 hover:scale-105">
    <circle cx="630" cy="240" r="62" fill="#1e3a5f" stroke="#93c5fd" stroke-width="2" />
    <!-- Continentes estilizados em giz verde/amarelo -->
    <path d="M 605 210 Q 625 200 635 220 Q 645 235 630 250 Q 615 240 605 210 Z" fill="#2d6a4f" opacity="0.75" />
    <path d="M 640 255 Q 655 245 665 260 Q 650 280 635 270 Z" fill="#2d6a4f" opacity="0.75" />
    <!-- Lado iluminado virado para o Sol -->
    <path d="M 630 178 A 62 62 0 0 0 630 302 Z" fill="#38bdf8" fill-opacity="0.12" />
    <text x="630" y="246" text-anchor="middle" fill="#f8fafc" font-size="17" font-weight="bold">TERRA</text>
    <text x="630" y="330" text-anchor="middle" fill="#93c5fd" font-size="13" font-weight="600">Observadores</text>
  </g>

  <!-- Ponto de impacto da Umbra na Terra -->
  <g id="el-umbra">
    <ellipse cx="630" cy="240" rx="3" ry="5" fill="#fda4af" stroke="#f43f5e" stroke-width="1.5" />
    <!-- Seta apontando a faixa de totalidade -->
    <path d="M 520 180 L 624 236" fill="none" stroke="#fda4af" stroke-width="1.5" marker-end="url(#chalkArrow)" />
    <text x="440" y="172" fill="#fda4af" font-size="14" font-weight="bold">UMBRA (Faixa de Totalidade)</text>
    <text x="440" y="190" fill="#fda4af" font-size="12">Disco solar 100% oculto</text>
  </g>

  <!-- Região de Penumbra na Terra -->
  <g id="el-penumbra">
    <path d="M 680 160 L 632 205" fill="none" stroke="#93c5fd" stroke-width="1.5" marker-end="url(#chalkArrowBlue)" />
    <text x="690" y="160" fill="#93c5fd" font-size="14" font-weight="bold">PENUMBRA</text>
    <text x="690" y="178" fill="#93c5fd" font-size="12">Eclipse Parcial (fração do Sol vista)</text>
  </g>

  <!-- Nota de escala científica obrigatória -->
  <rect x="50" y="420" width="220" height="30" rx="6" fill="#14261d" stroke="#f8fafc" stroke-width="0.8" opacity="0.9" />
  <text x="60" y="440" fill="#fef08a" font-size="12" font-style="italic">Diagrama didático fora de escala</text>
</svg>`,
          labels: [
            { id: 'el-sol', name: 'Sol (Fonte Extensa)', description: 'Emite luz em todas as direções a partir de sua superfície esférica gigante.', color: '#fef08a' },
            { id: 'el-lua', name: 'Lua (Objeto Bloqueador)', description: 'Fica exatamente no centro (alinhamento Sol-Lua-Terra) durante a Lua Nova.', color: '#f8fafc' },
            { id: 'el-terra', name: 'Terra (Superfície Receptora)', description: 'Onde estão os observadores. A sombra varre a superfície de oeste para leste.', color: '#93c5fd' },
            { id: 'el-umbra', name: 'Umbra Lunar', description: 'Cone afunilado onde a luz solar direta é 100% bloqueada. Gera o eclipse total.', color: '#fda4af' },
            { id: 'el-penumbra', name: 'Penumbra Lunar', description: 'Região externa onde apenas parte do disco do Sol é bloqueada. Gera o eclipse parcial.', color: '#93c5fd' },
          ],
        },
        openQuestion: 'Explique por que um observador situado na região da umbra vê um eclipse total, enquanto outro na penumbra vê um eclipse parcial, e onde a Lua deve estar em relação à Terra e ao Sol para isso acontecer?',
        referenceQuotes: [
          'No eclipse solar, a Lua posiciona-se exatamente entre o Sol e a Terra (ordem estrita: Sol -> Lua -> Terra)...',
          'Umbra: região cônica de sombra total onde todo o disco solar é bloqueado pela Lua...',
        ],
      },
      {
        id: 'c-eclipse-lunar',
        title: 'Eclipse Lunar: Alinhamento Sol — Terra — Lua',
        category: 'Geometria Celeste',
        pageOrSectionRef: 'Seção 3: Alinhamento Sol-Terra-Lua',
        summary: 'A Terra posiciona-se entre o Sol e a Lua durante a Lua Cheia. A Lua mergulha no grande cone de sombra terrestre e adquire tom avermelhado.',
        keyTakeaway: 'Ordem rigorosa: Sol -> Terra -> Lua. Ocorre na Lua Cheia. A atmosfera da Terra refrata luz vermelha para dentro da umbra.',
        representationType: 'diagram',
        representation: {
          title: 'Diagrama Óptico: A Terra Projetando Sombra na Lua',
          questionAnswered: 'Por que o eclipse lunar é visto por quase metade da Terra e por que a Lua fica avermelhada na totalidade?',
          svgCode: `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <radialGradient id="solGlowLunar" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fffbeb" stop-opacity="1" />
      <stop offset="60%" stop-color="#fef08a" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#eab308" stop-opacity="0.2" />
    </radialGradient>
    <linearGradient id="umbraTerraGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#450a0a" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#991b1b" stop-opacity="0.4" />
    </linearGradient>
    <linearGradient id="penumbraTerraGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#93c5fd" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#93c5fd" stop-opacity="0.05" />
    </linearGradient>
    <marker id="chalkArrowRed" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#fda4af" />
    </marker>
  </defs>

  <line x1="40" y1="240" x2="760" y2="240" stroke="#f8fafc" stroke-width="1" stroke-dasharray="4,6" opacity="0.25" />
  <text x="50" y="38" fill="#fda4af" font-family="'Caveat', cursive, sans-serif" font-size="24" font-weight="bold">ORDEM OBRIGATÓRIA: SOL → TERRA → LUA (LUA CHEIA)</text>
  <text x="50" y="62" fill="#93c5fd" font-size="13" font-family="sans-serif">A Terra bloqueia a luz solar direta; o cone de umbra terrestre é muito maior que o diâmetro da Lua</text>

  <!-- Penumbra Terrestre Externa -->
  <polygon points="120,160 380,185 750,110 750,370 380,295 120,320" fill="url(#penumbraTerraGrad)" />

  <!-- Umbra Terrestre Gigante -->
  <polygon points="380,185 750,215 750,265 380,295" fill="url(#umbraTerraGrad)" stroke="#fda4af" stroke-width="1.2" stroke-dasharray="3,3" />

  <!-- Linhas tangentes de luz -->
  <line x1="120" y1="160" x2="750" y2="215" stroke="#fef08a" stroke-width="1" opacity="0.6" />
  <line x1="120" y1="320" x2="750" y2="265" stroke="#fef08a" stroke-width="1" opacity="0.6" />

  <!-- 1. SOL (à esquerda) -->
  <g id="el-sol-lunar">
    <circle cx="120" cy="240" r="75" fill="url(#solGlowLunar)" stroke="#fef08a" stroke-width="2.5" />
    <text x="120" y="246" text-anchor="middle" fill="#1c1917" font-size="18" font-weight="bold">SOL</text>
  </g>

  <!-- 2. TERRA (no centro - projetando a sombra) -->
  <g id="el-terra-lunar">
    <circle cx="380" cy="240" r="55" fill="#1e3a5f" stroke="#93c5fd" stroke-width="2.5" />
    <!-- Atmosfera fina destacada ao redor da Terra (filtra luz) -->
    <circle cx="380" cy="240" r="58" fill="none" stroke="#f43f5e" stroke-width="1.8" stroke-dasharray="2,3" opacity="0.9" />
    <text x="380" y="246" text-anchor="middle" fill="#f8fafc" font-size="17" font-weight="bold">TERRA</text>
    <text x="380" y="325" text-anchor="middle" fill="#fda4af" font-size="13">Atmosfera refrata luz vermelha</text>
  </g>

  <!-- 3. LUA (à direita - imersa no cone da Umbra da Terra) -->
  <g id="el-lua-lunar">
    <!-- Órbita lunar tracejada -->
    <path d="M 660 120 Q 690 240 660 360" fill="none" stroke="#f8fafc" stroke-width="1.2" stroke-dasharray="3,3" opacity="0.5" />
    <!-- Lua avermelhada na umbra -->
    <circle cx="670" cy="240" r="18" fill="#991b1b" stroke="#fda4af" stroke-width="2" />
    <circle cx="670" cy="240" r="22" fill="none" stroke="#fda4af" stroke-width="1" stroke-dasharray="2,2" />
    <text x="670" y="205" text-anchor="middle" fill="#fda4af" font-size="15" font-weight="bold">LUA ECLIPSADA</text>
    <text x="670" y="280" text-anchor="middle" fill="#fda4af" font-size="12">"Lua de Sangue" (Umbra Total)</text>
  </g>

  <!-- Destaques e legendas -->
  <text x="500" y="246" text-anchor="middle" fill="#fda4af" font-size="14" font-weight="bold">UMBRA DA TERRA</text>
  <text x="500" y="265" text-anchor="middle" fill="#f8fafc" font-size="11" opacity="0.8">Cone de escuridão total</text>

  <path d="M 600 370 L 660 255" fill="none" stroke="#fda4af" stroke-width="1.5" marker-end="url(#chalkArrowRed)" />
  <text x="440" y="390" fill="#fda4af" font-size="13" font-weight="bold">Dispersão de Rayleigh:</text>
  <text x="440" y="408" fill="#f8fafc" font-size="12">O azul é espalhado na atmosfera da Terra; o vermelho curva-se e atinge a Lua.</text>
</svg>`,
          labels: [
            { id: 'el-sol-lunar', name: 'Sol', description: 'Fonte primária de luz solar à esquerda.', color: '#fef08a' },
            { id: 'el-terra-lunar', name: 'Terra (Intermediária)', description: 'Fica no centro, bloqueando a luz solar direta na direção da Lua.', color: '#93c5fd' },
            { id: 'el-lua-lunar', name: 'Lua na Umbra', description: 'Fase de Lua Cheia, totalmente imersa no cone de sombra terrestre.', color: '#fda4af' },
          ],
        },
        openQuestion: 'Por que durante um eclipse lunar a Lua não desaparece totalmente no céu escuro, mas adquire um tom avermelhado conhecido como "Lua de Sangue"?',
        referenceQuotes: [
          'No eclipse lunar, a Terra posiciona-se exatamente entre o Sol e a Lua (ordem estrita: Sol -> Terra -> Lua)...',
          'A Lua não fica totalmente invisível, mas adquire uma coloração avermelhada decorrente da dispersão de Rayleigh...',
        ],
      },
      {
        id: 'c-umbra-penumbra',
        title: 'Umbra vs. Penumbra: A Física das Sombras Cósmicas',
        category: 'Óptica e Sombras',
        pageOrSectionRef: 'Seção 4: Geometria da Fonte Extensa',
        summary: 'Diferenciação precisa entre o cone de escuridão total (umbra) e a região de iluminação parcial (penumbra) geradas por fontes extensas de luz.',
        keyTakeaway: 'A umbra afunila em direção oposta à fonte; a penumbra se expande em leque. O que um observador vê depende estritamente de qual região ele ocupa.',
        representationType: 'comparison',
        representation: {
          title: 'Comparação Óptica: Regiões de Umbra e Penumbra',
          questionAnswered: 'Como a geometria de raios luminosos tangentes separa fisicamente a umbra da penumbra?',
          svgCode: `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="splitUmbra" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#020617" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="splitPenumbra" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.08" />
    </linearGradient>
  </defs>

  <text x="40" y="40" fill="#fef08a" font-family="'Caveat', cursive, sans-serif" font-size="26" font-weight="bold">UMBRA vs. PENUMBRA: GEOMETRIA DA FONTE EXTENSA</text>

  <!-- Caixa Comparativa 1: Umbra -->
  <rect x="50" y="80" width="330" height="340" rx="12" fill="#13271c" stroke="#fda4af" stroke-width="2" />
  <rect x="50" y="80" width="330" height="48" rx="12" fill="#fda4af" fill-opacity="0.15" />
  <text x="215" y="112" text-anchor="middle" fill="#fda4af" font-size="18" font-weight="bold">CONE DE UMBRA</text>

  <!-- Diagrama interno da Umbra -->
  <polygon points="100,160 300,195 300,205 100,240" fill="url(#splitUmbra)" stroke="#fda4af" stroke-width="1.5" />
  <circle cx="100" cy="200" r="28" fill="#475569" stroke="#f8fafc" stroke-width="1.5" />
  <text x="100" y="205" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="bold">Corpo</text>
  <text x="270" y="185" fill="#fda4af" font-size="12" font-weight="bold">Vértice</text>

  <g transform="translate(70, 260)">
    <text x="0" y="0" fill="#f8fafc" font-size="13" font-weight="bold">Física da Região:</text>
    <text x="0" y="22" fill="#f8fafc" font-size="12">• Zero luz direta da fonte atinge o ponto.</text>
    <text x="0" y="42" fill="#f8fafc" font-size="12">• Cone convergente no sentido oposto à luz.</text>
    <text x="0" y="62" fill="#f8fafc" font-size="12">• Observador vê: Eclipse Total / Ocultação 100%.</text>
    <text x="0" y="82" fill="#fda4af" font-size="12" font-weight="600">• No céu: coroa solar visível em eclipse solar.</text>
  </g>

  <!-- Caixa Comparativa 2: Penumbra -->
  <rect x="420" y="80" width="330" height="340" rx="12" fill="#13271c" stroke="#93c5fd" stroke-width="2" />
  <rect x="420" y="80" width="330" height="48" rx="12" fill="#93c5fd" fill-opacity="0.15" />
  <text x="585" y="112" text-anchor="middle" fill="#93c5fd" font-size="18" font-weight="bold">CONE DE PENUMBRA</text>

  <!-- Diagrama interno da Penumbra -->
  <polygon points="460,190 700,150 700,250 460,210" fill="url(#splitPenumbra)" stroke="#93c5fd" stroke-width="1.5" stroke-dasharray="3,3" />
  <circle cx="460" cy="200" r="28" fill="#475569" stroke="#f8fafc" stroke-width="1.5" />
  <text x="460" y="205" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="bold">Corpo</text>
  <text x="640" y="170" fill="#93c5fd" font-size="12" font-weight="bold">Divergente</text>

  <g transform="translate(440, 260)">
    <text x="0" y="0" fill="#f8fafc" font-size="13" font-weight="bold">Física da Região:</text>
    <text x="0" y="22" fill="#f8fafc" font-size="12">• Parte da fonte é bloqueada, parte ilumina.</text>
    <text x="0" y="42" fill="#f8fafc" font-size="12">• Cone divergente que se alarga com a distância.</text>
    <text x="0" y="62" fill="#f8fafc" font-size="12">• Observador vê: Eclipse Parcial ("mordida").</text>
    <text x="0" y="82" fill="#93c5fd" font-size="12" font-weight="600">• Iluminação varia gradualmente da borda ao centro.</text>
  </g>
</svg>`,
          labels: [
            { id: 'lbl-umbra-comp', name: 'Umbra (Escuridão Total)', description: 'Bloqueio de 100% dos raios da fonte.', color: '#fda4af' },
            { id: 'lbl-penumbra-comp', name: 'Penumbra (Sombra Gradiente)', description: 'Bloqueio parcial; observador vê fração do Sol.', color: '#93c5fd' },
          ],
          comparisonColumns: [
            { columnTitle: 'Região de Umbra', items: ['Cone convergente', 'Escuridão total (0% de luz direta)', 'Gera eclipse total', 'Faixa estreita na superfície terrestre'] },
            { columnTitle: 'Região de Penumbra', items: ['Cone divergente em leque', 'Iluminação parcial gradativa', 'Gera eclipse parcial', 'Área de milhares de km de extensão'] },
          ],
        },
        openQuestion: 'Se você estivesse no espaço flutuando exatamente na borda entre a umbra e a penumbra da Lua, o que seus olhos observariam ao olhar para o Sol?',
        referenceQuotes: [
          'As retas tangentes externas definem a umbra; as cruzadas definem a penumbra...',
          'Umbra: cone convergente escuro; Penumbra: cone divergente gradual...',
        ],
      },
      {
        id: 'c-inclinacao-orbital',
        title: 'A Inclinação Orbital de 5° e a Linha dos Nós',
        category: 'Dinâmica Orbital',
        pageOrSectionRef: 'Seção 5: Por que não ocorrem todo mês',
        summary: 'A órbita lunar é inclinada em 5° em relação à órbita da Terra (eclíptica). Eclipses só ocorrem nos cruzamentos da Linha dos Nós.',
        keyTakeaway: 'A inclinação de 5° faz a sombra da Lua passar acima ou abaixo da Terra na maioria das Luas Novas e Cheias.',
        representationType: 'relation_schema',
        representation: {
          title: 'Esquema Tridimensional: Planos Orbitais e a Linha dos Nós',
          questionAnswered: 'Por que não temos eclipses todos os meses a cada Lua Nova e Lua Cheia?',
          svgCode: `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <marker id="nodeArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#fef08a" />
    </marker>
  </defs>

  <text x="40" y="38" fill="#fef08a" font-family="'Caveat', cursive, sans-serif" font-size="24" font-weight="bold">POR QUE NÃO HÁ ECLIPSES TODO MÊS? O ÂNGULO DE 5°</text>
  <text x="40" y="62" fill="#93c5fd" font-size="13" font-family="sans-serif">O plano da órbita lunar está inclinado ~5° em relação ao plano da órbita da Terra (Eclíptica)</text>

  <!-- Sol ao longe emitindo raios horizontais -->
  <circle cx="80" cy="240" r="45" fill="#fef08a" stroke="#eab308" stroke-width="2" />
  <text x="80" y="246" text-anchor="middle" fill="#1c1917" font-size="14" font-weight="bold">SOL</text>
  <line x1="125" y1="240" x2="350" y2="240" stroke="#fef08a" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.5" />

  <!-- Terra no centro dos dois planos -->
  <circle cx="440" cy="240" r="32" fill="#1e3a5f" stroke="#93c5fd" stroke-width="2" />
  <text x="440" y="246" text-anchor="middle" fill="#f8fafc" font-size="12" font-weight="bold">TERRA</text>

  <!-- 1. Plano da Eclíptica (Plano da Terra) - Linha horizontal azul -->
  <line x1="180" y1="240" x2="720" y2="240" stroke="#93c5fd" stroke-width="2" />
  <text x="730" y="245" fill="#93c5fd" font-size="13" font-weight="bold">Plano da Eclíptica (0°)</text>

  <!-- 2. Plano da Órbita da Lua (inclinado em 5°) - Linha coral inclinada -->
  <line x1="200" y1="290" x2="680" y2="190" stroke="#fda4af" stroke-width="2.5" />
  <text x="690" y="195" fill="#fda4af" font-size="13" font-weight="bold">Órbita Lunar (~5° de inclinação)</text>

  <!-- Ângulo demonstrado com arco de giz amarelo -->
  <path d="M 560 240 A 120 120 0 0 0 550 216" fill="none" stroke="#fef08a" stroke-width="2" />
  <text x="575" y="226" fill="#fef08a" font-size="16" font-weight="bold">5°09'</text>

  <!-- Posição 1: Lua Nova FORA DO NÓ (passa por cima) -->
  <g id="el-lua-cima">
    <circle cx="330" cy="265" r="14" fill="#64748b" stroke="#fda4af" stroke-width="1.5" />
    <path d="M 330 279 L 410 320" stroke="#fda4af" stroke-width="1" stroke-dasharray="2,2" />
    <text x="250" y="295" fill="#fda4af" font-size="12" font-weight="bold">Lua Nova Alta</text>
    <text x="250" y="312" fill="#f8fafc" font-size="11">Sombra passa "por cima" da Terra</text>
    <text x="250" y="328" fill="#fda4af" font-size="11">SEM ECLIPSE</text>
  </g>

  <!-- Posição 2: Linha dos Nós (Cruzamento EXATO) -->
  <g id="el-no-alinhado">
    <circle cx="440" cy="240" r="8" fill="#fef08a" />
    <!-- Seta apontando a interseção dos planos -->
    <path d="M 440 120 L 440 220" fill="none" stroke="#fef08a" stroke-width="2" marker-end="url(#nodeArrow)" />
    <rect x="340" y="80" width="200" height="42" rx="6" fill="#14261d" stroke="#fef08a" stroke-width="1.5" />
    <text x="440" y="98" text-anchor="middle" fill="#fef08a" font-size="13" font-weight="bold">LINHA DOS NÓS</text>
    <text x="440" y="114" text-anchor="middle" fill="#f8fafc" font-size="11">Interseção dos dois planos</text>
  </g>

  <!-- Caixa de conclusão didática -->
  <rect x="50" y="380" width="700" height="65" rx="8" fill="#13271c" stroke="#f8fafc" stroke-width="1" />
  <text x="70" y="405" fill="#fef08a" font-size="13" font-weight="bold">Condição Fundamental para Eclipses:</text>
  <text x="70" y="425" fill="#f8fafc" font-size="13">Para ocorrer eclipse, a Lua precisa estar na fase Nova ou Cheia E simultaneamente cruzando a Linha dos Nós.</text>
</svg>`,
          labels: [
            { id: 'lbl-plano-ecliptica', name: 'Plano da Eclíptica', description: 'Plano geométrico do movimento da Terra ao redor do Sol.', color: '#93c5fd' },
            { id: 'lbl-orbita-inclinada', name: 'Órbita Lunar Inclinada', description: 'Inclinada a 5°09\', impedindo alinhamentos mensais automáticos.', color: '#fda4af' },
            { id: 'lbl-linha-nos', name: 'Linha dos Nós', description: 'Os dois pontos de interseção onde eclipses são fisicamente possíveis.', color: '#fef08a' },
          ],
        },
        openQuestion: 'Se a órbita da Lua não tivesse nenhuma inclinação (0 graus em relação à Terra e ao Sol), quantos eclipses veríamos por ano e por quê?',
        referenceQuotes: [
          'Se o plano orbital da Lua coincidisse perfeitamente com a eclíptica, teríamos dois eclipses todos os meses...',
          'O plano orbital da Lua possui uma inclinação de aproximadamente 5°09\' em relação à eclíptica...',
        ],
      },
    ],
  },
  {
    id: 'sample-fotossintese',
    title: 'Fotossíntese e Respiração Celular: Bioenergética e Ciclos Vitais',
    summary: 'A maquinaria molecular da conversão de energia solar em glicose através dos tilacoides e estroma, e sua integração complementar com a respiração celular na mitocôndria.',
    sourceType: 'sample',
    sourceName: 'Material Pedagógico de Exemplo: Biologia Celular',
    originalContent: `FOTOSSÍNTESE E RESPIRAÇÃO CELULAR
1. A FASE FOTOQUÍMICA (REAÇÕES LUMINOSAS NOS TILACOIDES)
Ocorre na membrana dos tilacoides do cloroplasto. Fótons de luz solar excitam elétrons na clorofila dos fotossistemas II e I. Ocorre a fotólise da água (quebra da molécula de H2O), liberando gás oxigênio (O2) para a atmosfera, elétrons para a cadeia transportadora e prótons H+ para o lúmen. O fluxo de elétrons impulsiona a síntese de ATP (energia química) e reduz NADP+ a NADPH (poder redutor).

2. O CICLO DE CALVIN-BENSON (FASE ENZIMÁTICA NO ESTROMA)
Ocorre no fluido do estroma. A enzima RuBisCO fixa o gás carbônico (CO2) atmosférico na ribulose-1,5-bisfosfato (RuBP). Utilizando o ATP e o NADPH produzidos na fase clara, as moléculas são reduzidas a trioses fosfato (G3P), que originam a glicose (C6H12O6) e outros carboidratos.

3. RESPIRAÇÃO CELULAR: O PROCESSO COMPLEMENTAR
Nas mitocôndrias, a glicose é decomposta através da glicólise, ciclo de Krebs e cadeia respiratória, consumindo O2 e liberando CO2 e H2O, com alto rendimento de ATP para o trabalho celular. Os produtos da fotossíntese são os reagentes da respiração celular e vice-versa.`,
    sections: [
      { id: 'sec-f1', title: '1. Fase Clara no Tilacoide', reference: 'Seção 1: Fotólise da Água e ATP', summary: 'Conversão de energia luminosa em ATP e NADPH com liberação de O2.' },
      { id: 'sec-f2', title: '2. Ciclo de Calvin no Estroma', reference: 'Seção 2: Fixação de Carbono', summary: 'Uso de ATP e NADPH para sintetizar glicose a partir de CO2.' },
      { id: 'sec-f3', title: '3. Integração com a Respiração', reference: 'Seção 3: Ciclo Mitocondrial', summary: 'A respiração fecha o ciclo global consumindo glicose e O2.' },
    ],
    concepts: [
      {
        id: 'c-fase-luminosa',
        title: 'Fase Fotoquímica: Fotólise da Água no Tilacoide',
        category: 'Bioenergética',
        pageOrSectionRef: 'Seção 1: Fotólise da Água e ATP',
        summary: 'A luz solar excita a clorofila na membrana do tilacoide, quebrando a água e gerando O2, ATP e NADPH.',
        keyTakeaway: 'Entra: Luz + H2O. Sai: O2 (oxigênio) + ATP + NADPH (energia para o estroma).',
        representationType: 'process',
        representation: {
          title: 'Fluxo Bioquímico no Tilacoide',
          questionAnswered: 'De onde vem o oxigênio liberado pelas plantas e como a energia da luz é armazenada temporariamente?',
          svgCode: `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <marker id="bioArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#fef08a" />
    </marker>
    <marker id="bioArrowBlue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#93c5fd" />
    </marker>
  </defs>

  <text x="40" y="38" fill="#93c5fd" font-family="'Caveat', cursive, sans-serif" font-size="24" font-weight="bold">FASE CLARA: MEMBRANA DO TILACOIDE</text>

  <!-- Membrana lipídica do Tilacoide -->
  <rect x="50" y="160" width="700" height="120" rx="14" fill="#143322" stroke="#4ade80" stroke-width="2" />
  <text x="70" y="195" fill="#4ade80" font-size="14" font-weight="bold">Membrana do Tilacoide</text>

  <!-- Fóton de Luz Solar entrando -->
  <path d="M 100 80 Q 120 110 100 130 Q 120 150 140 180" fill="none" stroke="#fef08a" stroke-width="3" marker-end="url(#bioArrow)" />
  <text x="90" y="65" fill="#fef08a" font-size="16" font-weight="bold">Fótons (Luz)</text>

  <!-- Fotólise da Água H2O -> 2H+ + 1/2 O2 -->
  <g id="el-fotolise" transform="translate(160, 200)">
    <circle cx="50" cy="50" r="38" fill="#0f291e" stroke="#38bdf8" stroke-width="2" />
    <text x="50" y="46" text-anchor="middle" fill="#38bdf8" font-size="14" font-weight="bold">H₂O (Água)</text>
    <text x="50" y="65" text-anchor="middle" fill="#f8fafc" font-size="11">Fotólise</text>
    <!-- Seta de saída do Oxigênio -->
    <path d="M 50 12 L 50 -60" fill="none" stroke="#38bdf8" stroke-width="2" marker-end="url(#bioArrowBlue)" />
    <text x="55" y="-30" fill="#38bdf8" font-size="13" font-weight="bold">O₂ liberado</text>
  </g>

  <!-- Fotossistemas e Cadeia Transportadora -->
  <g id="el-cadeia" transform="translate(340, 200)">
    <rect x="0" y="20" width="120" height="60" rx="8" fill="#1e3a2f" stroke="#fef08a" stroke-width="2" />
    <text x="60" y="45" text-anchor="middle" fill="#fef08a" font-size="13" font-weight="bold">Fotossistemas</text>
    <text x="60" y="65" text-anchor="middle" fill="#f8fafc" font-size="11">Transporte e-</text>
  </g>

  <!-- Produção de ATP e NADPH indo para o Estroma -->
  <g id="el-atp" transform="translate(540, 190)">
    <circle cx="50" cy="50" r="35" fill="#0f291e" stroke="#fda4af" stroke-width="2" />
    <text x="50" y="46" text-anchor="middle" fill="#fda4af" font-size="13" font-weight="bold">ATP Síntese</text>
    <text x="50" y="65" text-anchor="middle" fill="#fef08a" font-size="11">+ NADPH</text>
    <!-- Seta para fora para o Ciclo de Calvin -->
    <path d="M 85 50 L 150 50" fill="none" stroke="#fda4af" stroke-width="2.5" marker-end="url(#bioArrow)" />
    <text x="160" y="45" fill="#fda4af" font-size="12" font-weight="bold">Para o Estroma</text>
    <text x="160" y="62" fill="#f8fafc" font-size="11">(Ciclo de Calvin)</text>
  </g>

  <rect x="50" y="380" width="700" height="60" rx="8" fill="#13271c" stroke="#f8fafc" stroke-width="1" />
  <text x="70" y="405" fill="#fef08a" font-size="13" font-weight="bold">Equação da Fase Clara:</text>
  <text x="70" y="425" fill="#f8fafc" font-size="13">Luz + H₂O + NADP⁺ + ADP + Pi → O₂ + NADPH + ATP</text>
</svg>`,
          labels: [
            { id: 'el-fotolise', name: 'Fotólise da Água', description: 'Quebra molecular que fornece elétrons e libera gás oxigênio O2.', color: '#38bdf8' },
            { id: 'el-cadeia', name: 'Cadeia de Transporte', description: 'Gera gradiente de prótons através da membrana do tilacoide.', color: '#fef08a' },
            { id: 'el-atp', name: 'ATP Sintase & NADPH', description: 'Baterias químicas de alta energia que alimentam a síntese de açúcar.', color: '#fda4af' },
          ],
          processSteps: [
            { step: 1, title: 'Absorção de Fótons', detail: 'A clorofila capta comprimentos de onda azuis e vermelhos da luz solar.' },
            { step: 2, title: 'Fotólise da Água', detail: 'H2O é dividida; o oxigênio O2 é expelido para a atmosfera como subproduto.' },
            { step: 3, title: 'Fosforilação e Redução', detail: 'Geração de ATP e NADPH, que migram imediatamente para o estroma.' },
          ],
        },
        openQuestion: 'Explique de onde exatamente surge o oxigênio (O2) que os seres humanos respiram: ele vem do gás carbônico (CO2) ou da água (H2O)? Como os experimentos comprovaram isso?',
        referenceQuotes: [
          'Ocorre a fotólise da água (quebra da molécula de H2O), liberando gás oxigênio (O2) para a atmosfera...',
        ],
      },
      {
        id: 'c-ciclo-calvin',
        title: 'Ciclo de Calvin: Fixação de Carbono no Estroma',
        category: 'Bioquímica Enzimática',
        pageOrSectionRef: 'Seção 2: Fixação de Carbono',
        summary: 'No estroma, a enzima RuBisCO fixa CO2 atmosférico e, com o ATP e NADPH da fase clara, sintetiza glicose.',
        keyTakeaway: 'Fase química independente de luz direta: converte carbono inorgânico gasoso em alimento orgânico sólido.',
        representationType: 'process',
        representation: {
          title: 'O Ciclo de Calvin e a Síntese de Carboidratos',
          questionAnswered: 'Como uma planta constrói sua biomassa sólida a partir do ar e da energia química acumulada?',
          svgCode: `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <marker id="cycleArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#4ade80" />
    </marker>
  </defs>

  <text x="40" y="38" fill="#4ade80" font-family="'Caveat', cursive, sans-serif" font-size="24" font-weight="bold">CICLO DE CALVIN-BENSON: O MOTOR DO ESTROMA</text>

  <!-- Anel Central do Ciclo -->
  <ellipse cx="400" cy="240" rx="160" ry="120" fill="none" stroke="#4ade80" stroke-width="3" stroke-dasharray="8,6" />

  <!-- Etapa 1: Fixação de CO2 pela RuBisCO -->
  <g transform="translate(400, 100)">
    <rect x="-80" y="-30" width="160" height="50" rx="8" fill="#143322" stroke="#fef08a" stroke-width="2" />
    <text x="0" y="-5" text-anchor="middle" fill="#fef08a" font-size="13" font-weight="bold">1. Fixação (CO₂)</text>
    <text x="0" y="12" text-anchor="middle" fill="#f8fafc" font-size="11">Enzima RuBisCO</text>
  </g>
  <!-- Entrada de CO2 -->
  <path d="M 400 30 L 400 68" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#cycleArrow)" />
  <text x="410" y="50" fill="#38bdf8" font-size="13" font-weight="bold">CO₂ do Ar</text>

  <!-- Etapa 2: Redução com ATP e NADPH -->
  <g transform="translate(580, 240)">
    <rect x="-70" y="-30" width="140" height="55" rx="8" fill="#143322" stroke="#fda4af" stroke-width="2" />
    <text x="0" y="-5" text-anchor="middle" fill="#fda4af" font-size="13" font-weight="bold">2. Redução</text>
    <text x="0" y="14" text-anchor="middle" fill="#f8fafc" font-size="11">Gasta ATP e NADPH</text>
  </g>

  <!-- Saída de Glicose C6H12O6 -->
  <path d="M 540 310 L 620 370" stroke="#fef08a" stroke-width="3" marker-end="url(#cycleArrow)" />
  <rect x="580" y="380" width="170" height="40" rx="8" fill="#eab308" />
  <text x="665" y="405" text-anchor="middle" fill="#1c1917" font-size="13" font-weight="bold">Glicose (C₆H₁₂O₆)</text>

  <!-- Etapa 3: Regeneração de RuBP -->
  <g transform="translate(220, 240)">
    <rect x="-70" y="-30" width="140" height="55" rx="8" fill="#143322" stroke="#93c5fd" stroke-width="2" />
    <text x="0" y="-5" text-anchor="middle" fill="#93c5fd" font-size="13" font-weight="bold">3. Regeneração</text>
    <text x="0" y="14" text-anchor="middle" fill="#f8fafc" font-size="11">Recria RuBP</text>
  </g>
</svg>`,
          labels: [
            { id: 'lbl-rubisco', name: 'RuBisCO', description: 'A enzima mais abundante da Terra; fixa átomos de carbono inorgânico.', color: '#fef08a' },
            { id: 'lbl-glicose', name: 'Glicose', description: 'Molécula orgânica que armazena a energia e estrutura o vegetal.', color: '#fda4af' },
          ],
        },
        openQuestion: 'Por que o Ciclo de Calvin é frequentemente chamado de "fase escura", mas na prática depende totalmente da fase clara para continuar funcionando?',
        referenceQuotes: [
          'A enzima RuBisCO fixa o gás carbônico (CO2) atmosférico... Utilizando o ATP e NADPH...',
        ],
      },
    ],
  },
];
