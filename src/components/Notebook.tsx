import React from 'react';
import { DocumentData, Concept } from '../types/classroom';
import { BookOpen, HelpCircle, FileText, RefreshCw, Image as ImageIcon, ChevronRight, Award } from 'lucide-react';

interface NotebookProps {
  document: DocumentData;
  selectedConceptId: string;
  onSelectConcept: (concept: Concept) => void;
  onOpenOriginalNotes: () => void;
  onChangeMaterial: () => void;
  onOpenAgoraEuExplico: () => void;
  onOpenInfographicModal: () => void;
  isGeneratingInfographic?: boolean;
}

export const Notebook: React.FC<NotebookProps> = ({
  document,
  selectedConceptId,
  onSelectConcept,
  onOpenOriginalNotes,
  onChangeMaterial,
  onOpenAgoraEuExplico,
  onOpenInfographicModal,
  isGeneratingInfographic,
}) => {
  return (
    <aside className="w-full lg:w-96 flex flex-col h-full bg-[#fbf9f4] border border-[#e5dec9] rounded-2xl shadow-xl overflow-hidden relative">
      {/* Detalhe de espiral/caderno na borda esquerda */}
      <div className="absolute top-0 bottom-0 left-0 w-3 bg-[#e8e0cc] border-r border-[#d4cbaf] flex flex-col justify-around py-4 z-10 pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="w-2.5 h-1.5 bg-[#4a3b32] rounded-full mx-auto shadow-sm" />
        ))}
      </div>

      {/* Cabeçalho do Caderno de Estudos */}
      <div className="pl-6 pr-5 pt-5 pb-4 border-b border-[#ebdcb9] bg-[#f5efe0]/80">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#855325]">
            <BookOpen className="w-4 h-4 text-[#b45309]" />
            <span>Caderno de Estudos</span>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#ebdcb9] text-[#633e1c]">
            {document.sourceType === 'pdf' ? 'PDF Analisado' : document.sourceType === 'notes' ? 'Anotações' : 'Material Didático'}
          </span>
        </div>

        <h3 className="font-bold text-lg text-[#292524] mt-1.5 leading-snug line-clamp-2">
          {document.title}
        </h3>

        {/* Resumo executivo do material */}
        <p className="text-xs text-[#57534e] mt-2 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-[#e8dfc7]">
          {document.summary}
        </p>
      </div>

      {/* Lista de Conceitos com scroll suave */}
      <div className="flex-1 overflow-y-auto pl-6 pr-4 py-4 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-[#78716c] uppercase tracking-wider px-1">
          <span>Conceitos Identificados</span>
          <span>{document.concepts.length} no total</span>
        </div>

        {document.concepts.map((concept, index) => {
          const isActive = concept.id === selectedConceptId;
          return (
            <button
              key={concept.id}
              onClick={() => onSelectConcept(concept)}
              className={`w-full text-left p-3.5 rounded-xl transition-all border relative ${
                isActive
                  ? 'bg-[#183928] text-white border-[#183928] shadow-md ring-2 ring-[#fef08a]'
                  : 'bg-white hover:bg-[#f6f2e8] text-[#292524] border-[#e7dfc8] shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                    isActive ? 'bg-[#224e37] text-[#fef08a]' : 'bg-[#f0ebe0] text-[#78716c]'
                  }`}
                >
                  {concept.category} · {concept.pageOrSectionRef}
                </span>
                <span
                  className={`text-xs font-mono font-bold shrink-0 ${
                    isActive ? 'text-[#fef08a]' : 'text-[#a8a29e]'
                  }`}
                >
                  0{index + 1}
                </span>
              </div>

              <h4
                className={`text-sm font-bold mt-1.5 leading-snug ${
                  isActive ? 'text-white' : 'text-[#1c1917]'
                }`}
              >
                {concept.title}
              </h4>

              <p
                className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
                  isActive ? 'text-emerald-100' : 'text-[#57534e]'
                }`}
              >
                {concept.summary}
              </p>

              {isActive && (
                <div className="mt-2.5 pt-2 border-t border-[#2a5940] flex items-center justify-between text-[11px] text-[#fef08a] font-medium">
                  <span>Ativo no quadro e no tutor</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Ações Fixadas do Caderno (Agora eu explico, Ver anotações, Infográfico, Trocar material) */}
      <div className="pl-6 pr-4 py-4 bg-[#f3ede0] border-t border-[#e2d8be] space-y-2">
        {/* Desafio "Agora eu explico" destacado */}
        <button
          onClick={onOpenAgoraEuExplico}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-sm shadow hover:from-amber-600 hover:to-amber-700 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Award className="w-4 h-4 text-amber-200" />
          <span>Agora eu explico</span>
        </button>

        {/* Gerador de Infográfico com Nano Banana Pro */}
        <button
          onClick={onOpenInfographicModal}
          disabled={isGeneratingInfographic}
          className="w-full py-2.5 px-4 rounded-xl bg-[#1e293b] text-white font-semibold text-xs shadow hover:bg-slate-800 active:scale-98 transition-all flex items-center justify-center gap-2 border border-slate-700 disabled:opacity-50"
        >
          <ImageIcon className="w-4 h-4 text-sky-400" />
          <span>
            {isGeneratingInfographic ? 'Gerando Infográfico...' : 'Criar infográfico (Nano Banana Pro)'}
          </span>
        </button>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={onOpenOriginalNotes}
            className="py-2 px-3 rounded-lg bg-white text-[#44403c] border border-[#d6ccb0] text-xs font-semibold hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-stone-600" />
            <span className="truncate">Ver anotações</span>
          </button>

          <button
            onClick={onChangeMaterial}
            className="py-2 px-3 rounded-lg bg-white text-[#b45309] border border-[#d6ccb0] text-xs font-semibold hover:bg-amber-50/60 transition-colors flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
            <span className="truncate">Trocar material</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
