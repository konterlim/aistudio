import React, { useState } from 'react';
import { DocumentData } from '../types/classroom';
import { SAMPLE_MATERIALS } from '../data/sampleMaterials';
import { Upload, FileText, Sparkles, BookOpen, AlertCircle, RefreshCw, X, ArrowRight } from 'lucide-react';

interface DocumentSelectorModalProps {
  isOpen: boolean;
  onClose?: () => void;
  canClose: boolean;
  onStartWithSample: (sample: DocumentData) => void;
  onAnalyzeNewDocument: (payload: { text?: string; pdfBase64?: string; filename?: string }) => Promise<void>;
  isAnalyzing: boolean;
  analysisError: string | null;
}

export const DocumentSelectorModal: React.FC<DocumentSelectorModalProps> = ({
  isOpen,
  onClose,
  canClose,
  onStartWithSample,
  onAnalyzeNewDocument,
  isAnalyzing,
  analysisError,
}) => {
  const [activeTab, setActiveTab] = useState<'upload_or_notes' | 'samples'>('upload_or_notes');
  const [pastedNotes, setPastedNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setFileError('Por favor, selecione um arquivo em formato PDF.');
      setSelectedFile(null);
      setFileBase64(null);
      return;
    }

    setFileError(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extract clean Base64 data from data URL
      const base64 = result.includes(';base64,') ? result.split(';base64,')[1] : result;
      setFileBase64(base64);
    };
    reader.onerror = () => {
      setFileError('Erro ao ler o arquivo PDF.');
    };
    reader.readAsDataURL(file);
  };

  const handleStartClass = async () => {
    if (selectedFile && fileBase64) {
      await onAnalyzeNewDocument({
        pdfBase64: fileBase64,
        filename: selectedFile.name,
      });
    } else if (pastedNotes.trim()) {
      await onAnalyzeNewDocument({
        text: pastedNotes.trim(),
        filename: 'Anotações coladas',
      });
    }
  };

  const hasInput = (selectedFile && fileBase64) || pastedNotes.trim().length > 20;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-3xl bg-[#fbf9f4] rounded-2xl shadow-2xl border-4 border-[#855325] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cabeçalho acolhedor da Sala de Aula */}
        <div className="px-6 py-4 bg-[#163223] text-stone-100 flex items-center justify-between border-b border-[#2b4c38]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#244f37] border border-[#fef08a]/40 flex items-center justify-center shadow">
              <BookOpen className="w-5 h-5 text-[#fef08a]" />
            </div>
            <div>
              <h2 className="font-bold text-lg font-['Plus_Jakarta_Sans',sans-serif] text-white">
                Minha sala de aula · Material de Estudo
              </h2>
              <p className="text-xs text-[#93c5fd]">
                Envie um PDF ou cole anotações para iniciar o quadro e o tutor
              </p>
            </div>
          </div>
          {canClose && onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Abas Superiores: Seu Próprio Material vs Materiais de Exemplo */}
        <div className="flex border-b border-[#ebdcb9] bg-[#f5efe0]">
          <button
            onClick={() => setActiveTab('upload_or_notes')}
            className={`flex-1 py-3 text-xs font-bold transition-colors flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'upload_or_notes'
                ? 'border-[#855325] text-[#855325] bg-[#fbf9f4]'
                : 'border-transparent text-[#78716c] hover:text-[#292524]'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Enviar PDF ou Colar Anotações</span>
          </button>
          <button
            onClick={() => setActiveTab('samples')}
            className={`flex-1 py-3 text-xs font-bold transition-colors flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'samples'
                ? 'border-[#855325] text-[#855325] bg-[#fbf9f4]'
                : 'border-transparent text-[#78716c] hover:text-[#292524]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Materiais Prontos de Exemplo</span>
          </button>
        </div>

        {/* Conteúdo da Aba */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {analysisError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-rose-900">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Não foi possível analisar o documento</span>
              </div>
              <p>{analysisError}</p>
              <p className="font-semibold text-rose-950 pt-1">
                Verifique se o PDF não está corrompido ou tente reenviar ou colar como texto.
              </p>
            </div>
          )}

          {activeTab === 'upload_or_notes' ? (
            <div className="space-y-4">
              {/* Opção 1: Upload de PDF */}
              <div className="p-4 rounded-xl bg-white border-2 border-dashed border-[#d6ccb0] hover:border-[#855325] transition-colors text-center">
                <input
                  type="file"
                  id="pdf-upload-input"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="pdf-upload-input"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[#855325]">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#292524] block">
                      {selectedFile ? selectedFile.name : 'Clique para selecionar um arquivo PDF'}
                    </span>
                    <span className="text-xs text-[#78716c]">
                      {selectedFile
                        ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Pronto para análise real`
                        : 'O modelo analisará figuras, páginas reais e conceitos'}
                    </span>
                  </div>
                </label>
                {fileError && <p className="text-xs text-rose-600 mt-2">{fileError}</p>}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#ebdcb9]" />
                <span className="text-xs font-bold text-[#a8a29e] uppercase">Ou cole suas anotações</span>
                <div className="flex-1 h-px bg-[#ebdcb9]" />
              </div>

              {/* Opção 2: Colar Anotações em Texto */}
              <div>
                <textarea
                  value={pastedNotes}
                  onChange={(e) => {
                    setPastedNotes(e.target.value);
                    if (selectedFile) setSelectedFile(null);
                  }}
                  placeholder="Cole aqui o texto do seu artigo, resumo de aula, livro ou anotações de estudo (ex: biologia celular, termodinâmica, história, etc.)..."
                  rows={6}
                  className="w-full p-4 rounded-xl border border-[#d6ccb0] bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#855325] text-xs leading-relaxed"
                />
                <span className="text-[11px] text-[#78716c] block mt-1">
                  Se o texto não tiver páginas numeradas, o tutor fará referências às seções reais, sem inventar números.
                </span>
              </div>
            </div>
          ) : (
            /* Lista de Materiais de Exemplo Claramente Separados */
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716c] block">
                Materiais de Exemplo pré-estruturados:
              </span>
              {SAMPLE_MATERIALS.map((sample) => (
                <div
                  key={sample.id}
                  className="p-4 rounded-xl bg-white border border-[#e5dec9] hover:border-[#855325] shadow-sm transition-all hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-[#855325]">
                        Exemplo Pronto
                      </span>
                      <span className="text-xs font-bold text-[#57534e]">
                        {sample.concepts.length} conceitos · SVGs didáticos
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-[#292524]">{sample.title}</h4>
                    <p className="text-xs text-[#78716c] line-clamp-2 leading-relaxed">
                      {sample.summary}
                    </p>
                  </div>
                  <button
                    onClick={() => onStartWithSample(sample)}
                    disabled={isAnalyzing}
                    className="shrink-0 px-4 py-2 rounded-xl bg-[#163223] text-[#fef08a] font-bold text-xs hover:bg-[#204933] transition-colors flex items-center gap-1.5 self-start sm:self-center"
                  >
                    <span>Carregar este exemplo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rodapé do Modal com Botão Obrigatório "Começar aula com este documento" */}
        <div className="px-6 py-4 bg-[#f5efe0] border-t border-[#ebdcb9] flex items-center justify-between gap-3">
          <div className="text-xs text-[#78716c]">
            {isAnalyzing
              ? 'Analisando documento real com o modelo Gemini...'
              : 'Ao trocar de material, o contexto do tutor será reiniciado.'}
          </div>

          {activeTab === 'upload_or_notes' && (
            <button
              onClick={handleStartClass}
              disabled={!hasInput || isAnalyzing}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#183928] to-[#255a3f] text-[#fef08a] font-bold text-sm shadow hover:from-[#1e4632] hover:to-[#2e6e4d] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#fef08a] border-t-transparent rounded-full animate-spin" />
                  <span>Analisando conteúdo...</span>
                </>
              ) : (
                <>
                  <span>Começar aula com este documento</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
