import React, { useState } from 'react';
import { InfographicData } from '../types/classroom';
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Sparkles,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Sliders,
  Eye,
} from 'lucide-react';

interface InfographicModalProps {
  isOpen: boolean;
  onClose: () => void;
  infographic: InfographicData | null;
  isLoading: boolean;
  errorInfo: { error: string; category?: string; userHelp?: string; details?: string } | null;
  onGenerate: (customDirection?: string) => Promise<void>;
  onCorrect: (correction: string) => Promise<void>;
  onReview: () => Promise<void>;
  onAskTutorAboutImage: () => void;
  activeTopic: string;
}

export const InfographicModal: React.FC<InfographicModalProps> = ({
  isOpen,
  onClose,
  infographic,
  isLoading,
  errorInfo,
  onGenerate,
  onCorrect,
  onReview,
  onAskTutorAboutImage,
  activeTopic,
}) => {
  const [zoomScale, setZoomScale] = useState(1);
  const [correctionInput, setCorrectionInput] = useState('');
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [customPromptInput, setCustomPromptInput] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [showReviewPanel, setShowReviewPanel] = useState(false);

  if (!isOpen) return null;

  const handleZoom = (delta: number) => {
    setZoomScale((prev) => Math.min(3, Math.max(0.5, prev + delta)));
  };

  const handleDownload = () => {
    if (!infographic?.imageUrl) return;
    const a = document.createElement('a');
    a.href = infographic.imageUrl;
    a.download = `infografico-${infographic.conceptTitle.toLowerCase().replace(/\s+/g, '-')}-2k.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleApplyCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionInput.trim() || isCorrecting) return;
    setIsCorrecting(true);
    try {
      await onCorrect(correctionInput.trim());
      setCorrectionInput('');
    } finally {
      setIsCorrecting(false);
    }
  };

  const handleTriggerReview = async () => {
    setIsReviewing(true);
    try {
      await onReview();
      setShowReviewPanel(true);
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-5xl bg-[#111827] text-white rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Barra Superior do Modal */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Infográfico Didático Editorial</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 border border-sky-600/40 text-sky-300">
                  gemini-3-pro-image (Nano Banana Pro)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-600/40 text-emerald-300">
                  16:9 · 2K Resolução
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tema: {activeTopic}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {infographic?.imageUrl && (
              <>
                <button
                  onClick={() => handleZoom(0.25)}
                  title="Aumentar zoom"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleZoom(-0.25)}
                  title="Diminuir zoom"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomScale(1)}
                  title="Restaurar zoom"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDownload}
                  className="py-1.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download 2K</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corpo Principal com Área de Imagem e Painel Didático */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Tratamento de Erro Real (Faturamento, Cota, Modelo, Permissões) */}
          {errorInfo && (
            <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-600 text-rose-100 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-rose-300">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{errorInfo.error}</span>
              </div>
              <p className="text-xs leading-relaxed text-rose-200">{errorInfo.userHelp}</p>
              {errorInfo.details && (
                <pre className="text-[11px] font-mono bg-black/40 p-2 rounded text-rose-300 overflow-x-auto">
                  {errorInfo.details}
                </pre>
              )}
              <div className="pt-1">
                <button
                  onClick={() => onGenerate()}
                  className="px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Tentar gerar novamente
                </button>
              </div>
            </div>
          )}

          {/* Estado de Carregamento Real */}
          {isLoading && (
            <div className="h-80 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-4 border-sky-500/20 border-t-sky-400 animate-spin" />
                <Sparkles className="w-6 h-6 text-sky-400 absolute inset-0 m-auto" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Criando infográfico com Nano Banana Pro...</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  Construindo direção visual didática (pergunta, ilustração central, seções e conclusão editorial) e renderizando em 16:9 2K.
                </p>
                <span className="text-[11px] text-amber-300/80 font-mono mt-2 block">
                  A sua conversa com o tutor Gemini Live permanece ativa durante a geração.
                </span>
              </div>
            </div>
          )}

          {/* Exibição da Imagem Gerada */}
          {!isLoading && infographic?.imageUrl && (
            <div className="space-y-4">
              {/* Moldura do Infográfico com controle de Pan / Zoom */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                <div
                  className="w-full h-full flex items-center justify-center transition-transform duration-200 origin-center"
                  style={{ transform: `scale(${zoomScale})` }}
                >
                  <img
                    src={infographic.imageUrl}
                    alt={`Infográfico sobre ${infographic.conceptTitle}`}
                    className="max-w-full max-h-full object-contain select-none"
                  />
                </div>

                {/* Badge no canto com especificações do modelo */}
                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-slate-300 flex items-center gap-2">
                  <span className="text-sky-400 font-semibold">Nano Banana Pro</span>
                  <span>·</span>
                  <span>16:9 Horizontal</span>
                  <span>·</span>
                  <span>2K Resolução</span>
                </div>
              </div>

              {/* Informações da Direção Visual Editorial */}
              {infographic.visualDirection && (
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-sky-400 uppercase tracking-wider text-[10px] block">
                    Direção Didática Aplicada:
                  </span>
                  <p>
                    <strong className="text-white">Pergunta:</strong> {infographic.visualDirection.mainQuestionPt}
                  </p>
                  <p>
                    <strong className="text-white">Conclusão:</strong> {infographic.visualDirection.conclusionPt}
                  </p>
                </div>
              )}

              {/* Barra de Ações: Perguntar ao Tutor & Solicitar Correção Pontual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {/* 1. Perguntar ao Tutor sobre a imagem */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-amber-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <MessageSquare className="w-4 h-4 text-amber-400" />
                      Interação com o Tutor de Voz
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Fornece esta imagem ao tutor Gemini Live para que você possa fazer perguntas por voz ou texto sobre ela.
                    </p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={onAskTutorAboutImage}
                      className="py-2 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Perguntar ao tutor sobre este infográfico</span>
                    </button>
                    <button
                      onClick={handleTriggerReview}
                      disabled={isReviewing}
                      className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-400" />
                      <span>{isReviewing ? 'Analisando...' : 'Revisão científica'}</span>
                    </button>
                  </div>
                </div>

                {/* 2. Campo para Solicitar Correção Específica ao Modelo de Imagem */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-sky-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Sliders className="w-4 h-4 text-sky-400" />
                      Solicitar Correção Específica à Imagem
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Envia a imagem atual e sua instrução (ex.: "aumentar o contraste das sombras", "destacar a umbra") preservando o restante.
                    </p>
                  </div>
                  <form onSubmit={handleApplyCorrection} className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={correctionInput}
                      onChange={(e) => setCorrectionInput(e.target.value)}
                      placeholder="Ex: Aumentar o tamanho das legendas..."
                      disabled={isCorrecting}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400"
                    />
                    <button
                      type="submit"
                      disabled={!correctionInput.trim() || isCorrecting}
                      className="py-1.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors disabled:opacity-50 shrink-0"
                    >
                      {isCorrecting ? 'Corrigindo...' : 'Corrigir'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Painel de Revisão Científica e Textual */}
              {(showReviewPanel || infographic.review) && (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-300 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-sky-400" />
                      Revisão Científica e Didática Assistida:
                    </span>
                    <button
                      onClick={() => setShowReviewPanel(false)}
                      className="text-slate-400 hover:text-white text-[11px] underline"
                    >
                      Ocultar
                    </button>
                  </div>
                  {infographic.review ? (
                    <div className="space-y-1.5">
                      <p>
                        <strong className="text-white">Coerência Científica:</strong>{' '}
                        {infographic.review.scientificCoherence}
                      </p>
                      <p>
                        <strong className="text-white">Legendas e Ortografia:</strong>{' '}
                        {infographic.review.labelsAndSpelling}
                      </p>
                      <div className="pt-1">
                        <strong className="text-white block">Recomendações de Atenção:</strong>
                        <ul className="list-disc list-inside space-y-0.5 mt-0.5 text-slate-300">
                          {infographic.review.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-amber-300/90 italic pt-1 text-[11px]">
                        ⚠️ {infographic.review.overallAccuracyNote}
                      </p>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">
                      Clique em "Revisão científica" para comparar a imagem com o conteúdo do documento.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Se ainda não gerou nenhuma imagem */}
          {!isLoading && !infographic?.imageUrl && !errorInfo && (
            <div className="h-80 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-sky-400" />
              </div>
              <div className="max-w-md">
                <h4 className="font-bold text-white text-base">Gerar Infográfico com Nano Banana Pro</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Cria uma visualização editorial 16:9 em resolução 2K com o modelo gemini-3-pro-image, com pergunta didática, ilustração central com rigor científico e seções explicativas em português.
                </p>
              </div>

              <div className="w-full max-w-md space-y-2">
                <input
                  type="text"
                  value={customPromptInput}
                  onChange={(e) => setCustomPromptInput(e.target.value)}
                  placeholder="Diretriz opcional (ex: focar nas duas perspectivas do observador)..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
                <button
                  onClick={() => onGenerate(customPromptInput.trim() || undefined)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white font-bold text-xs shadow hover:from-sky-500 hover:to-blue-500 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-sky-200" />
                  <span>Gerar Infográfico Agora (Nano Banana Pro)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
