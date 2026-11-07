import React, { useState } from 'react';
import { LiveStatus } from '../types/classroom';
import { Mic, MicOff, PhoneOff, RefreshCw, Volume2, ChevronDown, ChevronUp, MessageSquare, AlertCircle } from 'lucide-react';

interface TutorVoiceBarProps {
  status: LiveStatus;
  isMuted: boolean;
  errorMessage: string | null;
  onStartSession: () => void;
  onEndSession: () => void;
  onToggleMute: () => void;
  onRetry: () => void;
  transcriptHistory: Array<{ role: 'user' | 'tutor' | 'system'; text: string }>;
  activeConceptTitle: string;
}

export const TutorVoiceBar: React.FC<TutorVoiceBarProps> = ({
  status,
  isMuted,
  errorMessage,
  onStartSession,
  onEndSession,
  onToggleMute,
  onRetry,
  transcriptHistory,
  activeConceptTitle,
}) => {
  const [showTranscript, setShowTranscript] = useState(false);

  const isConnected = status === 'listening' || status === 'speaking' || status === 'connecting';

  return (
    <header className="sticky top-0 z-40 bg-[#f7f3e8]/95 backdrop-blur-md border-b border-[#e5dec9] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Identidade do Aplicativo e Título da Sala de Aula */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#163223] border border-[#5c3e26] flex items-center justify-center shadow-md">
            <span className="font-['Caveat',cursive] text-2xl font-bold text-[#fef08a]">M</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-[#292524] font-['Plus_Jakarta_Sans',sans-serif] leading-tight">
              Minha sala de aula
            </h1>
            <span className="text-xs text-[#78716c] font-medium block">
              Tutor interativo · {activeConceptTitle}
            </span>
          </div>
        </div>

        {/* Controles Principais do Tutor Gemini Live */}
        <div className="flex items-center gap-2.5">
          {!isConnected && status !== 'error' && (
            <button
              onClick={onStartSession}
              className="py-2 px-5 rounded-full bg-gradient-to-r from-[#183928] to-[#255a3f] text-[#fef08a] font-bold text-sm shadow-md hover:from-[#1e4632] hover:to-[#2e6e4d] hover:shadow-lg active:scale-95 transition-all flex items-center gap-2 border border-[#fef08a]/40"
            >
              <Mic className="w-4 h-4 text-emerald-300" />
              <span>Conversar com o tutor</span>
            </button>
          )}

          {status === 'connecting' && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold">
              <span className="inline-block w-3.5 h-3.5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
              <span>Conectando com o tutor...</span>
            </div>
          )}

          {(status === 'listening' || status === 'speaking') && (
            <div className="flex items-center gap-2 bg-white/90 border border-[#d6ccb0] rounded-full p-1 shadow-sm">
              {/* Indicador de Status Real com Onda Sonora */}
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                  status === 'speaking'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {status === 'speaking' ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                    <span>Tutor explicando...</span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                    <span>Ouvindo você...</span>
                  </>
                )}
              </div>

              {/* Botão Mudo/Desmudo */}
              <button
                onClick={onToggleMute}
                title={isMuted ? 'Ativar microfone' : 'Silenciar microfone'}
                className={`p-2 rounded-full transition-colors ${
                  isMuted ? 'bg-rose-100 text-rose-700' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Botão Encerrar Sessão */}
              <button
                onClick={onEndSession}
                title="Encerrar conversa com o tutor"
                className="p-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
              >
                <PhoneOff className="w-4 h-4" />
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-full px-3 py-1.5 text-xs text-rose-800 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="truncate max-w-[200px]" title={errorMessage || 'Erro na sessão'}>
                {errorMessage || 'Falha na conexão'}
              </span>
              <button
                onClick={onRetry}
                className="font-bold underline text-rose-900 hover:text-black flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Tentar novamente
              </button>
            </div>
          )}

          {/* Botão Transcrição Expansível */}
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#d6ccb0] text-[#57534e] text-xs font-semibold hover:bg-stone-50 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Transcrição</span>
            {showTranscript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Painel Expansível de Transcrição da Conversa com Gemini Live */}
      {showTranscript && (
        <div className="max-w-7xl mx-auto px-4 pb-3 animate-in slide-in-from-top-2">
          <div className="bg-white rounded-xl border border-[#e5dec9] p-3 shadow-md max-h-48 overflow-y-auto space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#78716c] uppercase tracking-wider border-b border-[#f0ebe0] pb-1">
              <span>Diálogo com o Tutor de Voz</span>
              <span className="text-[11px] font-normal text-stone-400">Tempo real</span>
            </div>

            {transcriptHistory.length === 0 ? (
              <p className="text-xs text-stone-400 italic text-center py-3">
                Nenhuma fala registrada ainda. Clique em "Conversar com o tutor" para iniciar.
              </p>
            ) : (
              transcriptHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`text-xs p-2 rounded-lg leading-relaxed ${
                    item.role === 'tutor'
                      ? 'bg-emerald-50 text-emerald-950 border border-emerald-100'
                      : item.role === 'user'
                      ? 'bg-amber-50 text-amber-950 border border-amber-100 ml-6'
                      : 'bg-stone-100 text-stone-700 italic text-center'
                  }`}
                >
                  <span className="font-bold mr-1 block sm:inline">
                    {item.role === 'tutor' ? 'Tutor:' : item.role === 'user' ? 'Você:' : 'Sistema:'}
                  </span>
                  <span>{item.text}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </header>
  );
};
