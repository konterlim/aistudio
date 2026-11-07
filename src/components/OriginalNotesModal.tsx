import React from 'react';
import { DocumentData } from '../types/classroom';
import { FileText, X, Bookmark, Layers } from 'lucide-react';

interface OriginalNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentData;
}

export const OriginalNotesModal: React.FC<OriginalNotesModalProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-3xl bg-[#fbf9f4] rounded-2xl shadow-2xl border-4 border-[#855325] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabeçalho */}
        <div className="px-6 py-4 bg-[#855325] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-200" />
            <div>
              <h3 className="font-bold text-base">Anotações e Conteúdo Original</h3>
              <p className="text-xs text-amber-200/90">{document.sourceName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Seções extraídas com referências exatas de páginas ou seções */}
          {document.sections && document.sections.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716c] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#855325]" />
                Seções e Referências Documentadas:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {document.sections.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-3 rounded-xl bg-white border border-[#e5dec9] shadow-sm text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-[#292524]">
                      <span>{sec.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                        {sec.reference}
                      </span>
                    </div>
                    <p className="text-[#57534e] leading-relaxed">{sec.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Texto integral do documento */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78716c] flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-[#855325]" />
              Transcrição Integral do Material:
            </span>
            <div className="p-4 rounded-xl bg-white border border-[#e5dec9] text-xs font-mono text-stone-800 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto shadow-inner">
              {document.originalContent || 'Conteúdo em formato binário (PDF processado diretamente pelo modelo).'}
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="px-6 py-3 bg-[#f5efe0] border-t border-[#e2d8be] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#855325] text-white text-xs font-bold hover:bg-[#6e431c] transition-colors"
          >
            Fechar visualização
          </button>
        </div>
      </div>
    </div>
  );
};
