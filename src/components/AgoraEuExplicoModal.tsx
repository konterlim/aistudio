import React, { useState, useEffect, useRef } from 'react';
import { Concept, EvaluationResult } from '../types/classroom';
import { Award, Mic, MicOff, Send, CheckCircle2, AlertTriangle, ArrowLeft, RefreshCw, X, Sparkles } from 'lucide-react';

interface AgoraEuExplicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  concept: Concept;
  documentContext: string;
  onEvaluate: (explanation: string) => Promise<EvaluationResult>;
}

export const AgoraEuExplicoModal: React.FC<AgoraEuExplicoModalProps> = ({
  isOpen,
  onClose,
  concept,
  documentContext,
  onEvaluate,
}) => {
  const [explanationText, setExplanationText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported in browser
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'pt-BR';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setExplanationText((prev) => {
          // Append if typing was already there, or replace
          return transcript;
        });
      };

      recognition.onerror = (e: any) => {
        console.error('Erro no reconhecimento de fala do navegador:', e);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Reconhecimento de voz não suportado neste navegador. Por favor, digite sua explicação.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleFinishExplanation = async () => {
    if (!explanationText.trim()) return;
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    setIsEvaluating(true);
    setEvalError(null);
    try {
      const result = await onEvaluate(explanationText.trim());
      setEvaluationResult(result);
    } catch (err: any) {
      setEvalError(err?.message || 'Erro ao avaliar a explicação.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleResetForRetry = () => {
    setEvaluationResult(null);
    setEvalError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#fbf9f4] rounded-2xl shadow-2xl border-4 border-[#855325] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabeçalho da página de avaliação estilo folha de caderno dourada */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#855325] to-[#633e1c] text-[#fef08a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-300" />
            <div>
              <h3 className="font-bold text-lg font-['Caveat',cursive] tracking-wide text-white">
                Desafio: Agora eu explico!
              </h3>
              <p className="text-xs text-[#fef08a]/90 font-medium">
                Conceito: {concept.title}
              </p>
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
          {/* Pergunta Aberta formulada a partir do material */}
          <div className="p-4 rounded-xl bg-[#f3ede0] border-2 border-[#d6ccb0] shadow-sm">
            <span className="text-xs uppercase tracking-wider font-bold text-[#855325] block mb-1">
              Pergunta do Professor para Você:
            </span>
            <p className="text-base font-semibold text-[#292524] leading-snug">
              "{concept.openQuestion}"
            </p>
            <span className="text-xs text-[#78716c] mt-2 block italic">
              Dica: Não precisa decorar palavras exatas. Explique com suas próprias palavras como você entendeu!
            </span>
          </div>

          {!evaluationResult ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#57534e] uppercase tracking-wider">
                    Sua explicação (editável):
                  </label>
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border transition-all ${
                      isRecording
                        ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isRecording ? 'Gravando voz... Clique para parar' : 'Falar por voz'}</span>
                  </button>
                </div>

                <textarea
                  value={explanationText}
                  onChange={(e) => setExplanationText(e.target.value)}
                  placeholder="Escreva ou dite aqui sua explicação detalhada sobre o conceito..."
                  rows={6}
                  className="w-full p-4 rounded-xl border border-[#d6ccb0] bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#855325] leading-relaxed text-sm shadow-inner"
                />
              </div>

              {evalError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                  {evalError}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-[#d6ccb0] text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao quadro
                </button>

                <button
                  type="button"
                  onClick={handleFinishExplanation}
                  disabled={!explanationText.trim() || isEvaluating}
                  className="px-6 py-2.5 rounded-xl bg-[#855325] text-white font-bold text-sm shadow-md hover:bg-[#6e431c] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isEvaluating ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>O professor está avaliando...</span>
                    </>
                  ) : (
                    <>
                      <span>Terminei minha explicação</span>
                      <Send className="w-4 h-4 text-[#fef08a]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Resultado da Avaliação Formativa Real */
            <div className="space-y-4 animate-in fade-in">
              {/* Badge de Nível de Compreensão */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#e5dec9] shadow-sm">
                <div>
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Diagnóstico de Compreensão
                  </span>
                  <span className="text-sm font-extrabold text-[#292524]">
                    {evaluationResult.masteryLevel === 'compreensao_solida' && '🌟 Compreensão Sólida e Precisa!'}
                    {evaluationResult.masteryLevel === 'em_progresso' && '🌱 Bom Caminho, em Progresso!'}
                    {evaluationResult.masteryLevel === 'iniciando' && '🔍 Conceito Inicial (Vamos Revisar)'}
                  </span>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                    evaluationResult.masteryLevel === 'compreensao_solida'
                      ? 'bg-emerald-100 text-emerald-800'
                      : evaluationResult.masteryLevel === 'em_progresso'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {evaluationResult.masteryLevel.replace('_', ' ')}
                </span>
              </div>

              {/* O que entendeu corretamente */}
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wide mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>O que você entendeu muito bem:</span>
                </div>
                <p className="text-sm text-emerald-950 leading-relaxed font-medium">
                  {evaluationResult.whatUnderstood}
                </p>
              </div>

              {/* O que faltou ou confundiu */}
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wide mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>O que faltou ou gerou confusão:</span>
                </div>
                <p className="text-sm text-amber-950 leading-relaxed font-medium">
                  {evaluationResult.whatMissingOrConfused}
                </p>
              </div>

              {/* Correção pontual e específica */}
              <div className="p-4 rounded-xl bg-sky-50/80 border border-sky-200">
                <div className="flex items-center gap-2 text-sky-900 font-bold text-xs uppercase tracking-wide mb-1">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>Correção direta do professor:</span>
                </div>
                <p className="text-sm text-sky-950 leading-relaxed font-medium">
                  {evaluationResult.specificCorrection}
                </p>
              </div>

              {/* Mensagem acolhedora de encerramento */}
              <p className="text-xs text-stone-600 italic text-center font-medium">
                "{evaluationResult.encouragement}"
              </p>

              {/* Botões de Ação Pós-avaliação */}
              <div className="flex items-center justify-between pt-2 border-t border-[#ebdcb9]">
                <button
                  type="button"
                  onClick={handleResetForRetry}
                  className="px-4 py-2.5 rounded-xl border border-amber-600 text-amber-900 bg-amber-50 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  Tentar explicar novamente
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#163223] text-[#fef08a] font-bold text-sm shadow hover:bg-[#1f4430] transition-colors"
                >
                  Voltar ao quadro verde
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
