import React, { useState, useEffect } from 'react';
import { Concept } from '../types/classroom';
import { Lightbulb, RotateCcw, Globe, Zap, Send, Sparkles, CheckCircle2, Info } from 'lucide-react';

interface ChalkboardProps {
  concept: Concept;
  onAskQuestion: (question: string, shortcutType?: string) => Promise<void>;
  isLoadingQuestion: boolean;
  tutorAnswer: { answer: string; boardAnnotation?: string; highlightElementId?: string; updatedSvgCode?: string } | null;
  onApplySvgUpdate?: (newSvg: string) => void;
  activeHighlightId: string | null;
  onSelectHighlight: (id: string | null) => void;
  liveToolHighlightId?: string | null;
  liveToolNote?: string | null;
}

export const Chalkboard: React.FC<ChalkboardProps> = ({
  concept,
  onAskQuestion,
  isLoadingQuestion,
  tutorAnswer,
  onApplySvgUpdate,
  activeHighlightId,
  onSelectHighlight,
  liveToolHighlightId,
  liveToolNote,
}) => {
  const [questionInput, setQuestionInput] = useState('');
  const [customSvg, setCustomSvg] = useState<string | null>(null);

  // Reset custom SVG when concept changes
  useEffect(() => {
    setCustomSvg(null);
  }, [concept.id]);

  // When tutorAnswer provides updated SVG, keep it in mind
  useEffect(() => {
    if (tutorAnswer?.updatedSvgCode) {
      setCustomSvg(tutorAnswer.updatedSvgCode);
    }
  }, [tutorAnswer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim() || isLoadingQuestion) return;
    onAskQuestion(questionInput.trim());
    setQuestionInput('');
  };

  const handleShortcut = (type: string, promptText: string) => {
    if (isLoadingQuestion) return;
    onAskQuestion(promptText, type);
  };

  // Determine current active highlight: either from Live tutor or student interaction
  const effectiveHighlight = liveToolHighlightId || activeHighlightId || tutorAnswer?.highlightElementId;

  // Insert subtle highlighting into the SVG string if active
  const svgToRender = customSvg || concept.representation.svgCode;

  return (
    <div className="flex flex-col h-full rounded-2xl shadow-2xl overflow-hidden border-8 border-[#543820] bg-[#163223] text-stone-100 relative">
      {/* Moldura de madeira clássica com veios sutis */}
      <div className="absolute inset-0 pointer-events-none border border-[#3b2413]/60 shadow-[inset_0_0_30px_rgba(0,0,0,0.85)] z-20 rounded-xl" />

      {/* Topo do quadro: Título, Categoria e Referência da Página */}
      <div className="relative z-10 px-6 py-4 bg-[#142e20]/90 border-b border-[#244733] flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#fef08a] bg-[#244733]/80 px-2.5 py-0.5 rounded">
              {concept.category}
            </span>
            <span className="text-xs text-[#93c5fd] font-medium flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              {concept.pageOrSectionRef}
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#f8fafc] mt-1 font-['Caveat',cursive]">
            {concept.title}
          </h2>
        </div>

        {/* Banner com a pergunta que o desenho responde */}
        <div className="max-w-md bg-[#0f2419]/90 border border-[#fef08a]/30 px-3.5 py-1.5 rounded-lg text-right">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#fef08a] block">
            Pergunta respondida pelo quadro:
          </span>
          <p className="text-xs text-stone-200 italic font-medium leading-tight">
            "{concept.representation.questionAnswered}"
          </p>
        </div>
      </div>

      {/* Alerta de destaque do Tutor ao vivo */}
      {liveToolNote && (
        <div className="relative z-10 bg-amber-500/20 border-b border-amber-400/40 px-6 py-2 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="font-semibold">O Tutor destacou no quadro:</span>
            <span>{liveToolNote}</span>
          </div>
          <button
            onClick={() => onSelectHighlight(null)}
            className="text-amber-300 hover:text-white underline text-[11px]"
          >
            Limpar destaque
          </button>
        </div>
      )}

      {/* Área central principal do quadro (Diagrama SVG e Legendas Didáticas) */}
      <div className="relative z-10 flex-1 p-6 flex flex-col justify-between overflow-y-auto">
        <div className="w-full h-auto min-h-[300px] max-h-[460px] flex items-center justify-center relative bg-[#132b1e]/50 rounded-xl p-2 border border-[#214230] shadow-inner">
          {/* Anotação de Giz Dinâmica */}
          {tutorAnswer?.boardAnnotation && (
            <div className="absolute top-4 right-4 z-30 bg-[#163223]/90 border border-[#fef08a] px-3 py-1.5 rounded-md shadow-lg max-w-xs animate-in fade-in zoom-in-95">
              <span className="text-[10px] uppercase font-bold text-[#fef08a] tracking-wider block">Nota de Giz do Tutor:</span>
              <p className="text-sm font-['Caveat',cursive] text-yellow-100 font-bold">
                ✍️ {tutorAnswer.boardAnnotation}
              </p>
            </div>
          )}

          {/* Renderização do SVG Didático */}
          <div
            className="w-full h-full flex items-center justify-center max-w-[850px] transition-all duration-300"
            dangerouslySetInnerHTML={{ __html: svgToRender }}
          />
        </div>

        {/* Legendas didáticas interativas com cores de giz */}
        <div className="mt-4 pt-3 border-t border-[#234834]">
          <span className="text-xs uppercase tracking-wider font-bold text-[#fef08a] block mb-2">
            Elementos em destaque no desenho (clique para focar):
          </span>
          <div className="flex flex-wrap gap-2">
            {concept.representation.labels.map((lbl) => {
              const isSelected = effectiveHighlight === lbl.id;
              return (
                <button
                  key={lbl.id}
                  onClick={() => onSelectHighlight(isSelected ? null : lbl.id)}
                  style={{
                    borderColor: lbl.color || '#fef08a',
                  }}
                  className={`text-xs px-3 py-1.5 rounded-md text-left transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-white/20 text-white font-bold ring-2 ring-[#fef08a]'
                      : 'bg-[#12281c] text-stone-200 hover:bg-[#1a3827]'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: lbl.color || '#fef08a' }}
                  />
                  <span className="font-semibold">{lbl.name}:</span>
                  <span className="opacity-90">{lbl.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resposta do tutor na conversa sob demanda */}
        {tutorAnswer && (
          <div className="mt-4 p-4 rounded-xl bg-[#0f2419] border border-[#2d5940] shadow-lg animate-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#fef08a] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                Explicação do Tutor no Quadro:
              </span>
              {customSvg && onApplySvgUpdate && (
                <span className="text-[11px] text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Quadro atualizado com nova representação
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed text-stone-200 whitespace-pre-line font-medium">
              {tutorAnswer.answer}
            </p>
          </div>
        )}
      </div>

      {/* Rodapé do quadro: Campo de Perguntas e Atalhos Didáticos */}
      <div className="relative z-10 p-5 bg-[#12291d] border-t-2 border-[#204430] space-y-3">
        {/* Os 4 Atalhos Didáticos Obrigatórios */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => handleShortcut('nao_entendi', 'Não entendi esta parte. Pode me explicar de forma mais intuitiva?')}
            disabled={isLoadingQuestion}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[#183928] text-amber-200 hover:bg-[#204b35] hover:text-white border border-amber-300/30 transition-all disabled:opacity-50"
          >
            <Lightbulb className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span className="truncate">Não entendi esta parte</span>
          </button>

          <button
            onClick={() => handleShortcut('outra_maneira', 'Pode me explicar este conceito de outra maneira completamente diferente?')}
            disabled={isLoadingQuestion}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[#183928] text-blue-200 hover:bg-[#204b35] hover:text-white border border-blue-300/30 transition-all disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">Explique de outra maneira</span>
          </button>

          <button
            onClick={() => handleShortcut('exemplo_dia_a_dia', 'Poderia me dar um exemplo concreto e do dia a dia sobre isso?')}
            disabled={isLoadingQuestion}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[#183928] text-emerald-200 hover:bg-[#204b35] hover:text-white border border-emerald-300/30 transition-all disabled:opacity-50"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Exemplo do dia a dia</span>
          </button>

          <button
            onClick={() => handleShortcut('o_que_acontece_se', 'O que acontece se mudarmos as variáveis ou as condições deste conceito?')}
            disabled={isLoadingQuestion}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[#183928] text-rose-200 hover:bg-[#204b35] hover:text-white border border-rose-300/30 transition-all disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">E se mudarmos isso?</span>
          </button>
        </div>

        {/* Campo para escrever perguntas personalizadas */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder={`Faça uma pergunta sobre "${concept.title}"...`}
            disabled={isLoadingQuestion}
            className="flex-1 bg-[#0c1f15] border border-[#2d583f] rounded-lg px-4 py-2.5 text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#fef08a] transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!questionInput.trim() || isLoadingQuestion}
            className="px-5 py-2.5 rounded-lg bg-[#fef08a] text-[#1c1917] font-bold text-sm hover:bg-yellow-300 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none shadow"
          >
            {isLoadingQuestion ? (
              <span className="animate-spin inline-block w-4 h-4 border-2 border-stone-800 border-t-transparent rounded-full" />
            ) : (
              <>
                <span>Perguntar</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Canaleta inferior de giz de madeira com apagador e gizes coloridos */}
      <div className="relative z-10 h-7 bg-[#462d18] border-t-2 border-[#2b1b0d] flex items-center justify-between px-6 shadow-inner">
        {/* Gizes na canaleta: branco, amarelo, azul claro, coral */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-2.5 bg-stone-100 rounded-sm shadow-sm" title="Giz Branco" />
          <div className="w-8 h-2.5 bg-[#fef08a] rounded-sm shadow-sm" title="Giz Amarelo" />
          <div className="w-8 h-2.5 bg-[#93c5fd] rounded-sm shadow-sm" title="Giz Azul Claro" />
          <div className="w-8 h-2.5 bg-[#fda4af] rounded-sm shadow-sm" title="Giz Coral" />
        </div>
        {/* Apagador clássico com feltro */}
        <div className="flex items-center gap-2">
          <div className="h-4 px-3 bg-[#85542b] border border-[#3e240f] rounded text-[10px] text-[#fbf8ee] font-serif font-bold shadow flex items-center">
            Apagador de feltro
          </div>
          <span className="text-[11px] text-amber-200/80 font-mono">Minha sala de aula</span>
        </div>
      </div>
    </div>
  );
};
