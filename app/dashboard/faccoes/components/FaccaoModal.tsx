'use client';

import { useState, useTransition } from 'react';
import { X, Loader2, Factory, AlertCircle } from 'lucide-react';
import { createFaccao, updateFaccao } from '@/app/actions/faccoes';

interface Faccao {
  id: number;
  codigo: string;
  nome: string;
  contato: string | null;
  ativo: boolean;
}

interface FaccaoModalProps {
  modo: 'criar' | 'editar';
  faccao?: Faccao;
  onClose: () => void;
  onSuccess: () => void;
}

export function FaccaoModal({ modo, faccao, onClose, onSuccess }: FaccaoModalProps) {
  const [erro, setErro] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [ativo, setAtivo] = useState(faccao ? faccao.ativo : true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);

    const formData = new FormData(e.currentTarget);
    formData.set('ativo', String(ativo));

    startTransition(async () => {
      const result =
        modo === 'criar'
          ? await createFaccao(formData)
          : await updateFaccao(faccao!.id, formData);

      if (result?.error) {
        setErro(result.error);
      } else {
        onSuccess();
        onClose();
      }
    });
  }

  const inputCls =
    'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const labelCls = 'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {modo === 'criar' ? 'Nova Facção' : 'Editar Facção'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          {erro && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-medium">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {erro}
            </div>
          )}

          <div>
            <label className={labelCls} htmlFor="codigo">Código *</label>
            <input
              id="codigo"
              name="codigo"
              type="text"
              className={inputCls}
              placeholder="Ex: F001"
              defaultValue={faccao?.codigo ?? ''}
              required
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="nome">Nome da Facção *</label>
            <input
              id="nome"
              name="nome"
              type="text"
              className={inputCls}
              placeholder="Ex: Costura Silva"
              defaultValue={faccao?.nome ?? ''}
              required
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="contato">Contato (Telefone / WhatsApp)</label>
            <input
              id="contato"
              name="contato"
              type="text"
              className={inputCls}
              placeholder="Ex: (11) 99999-9999"
              defaultValue={faccao?.contato ?? ''}
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={ativo}
                  onChange={(e) => setAtivo(e.target.checked)}
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${ativo ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${ativo ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
              <span className={`text-sm font-semibold ${ativo ? 'text-green-700' : 'text-gray-500'}`}>
                {ativo ? 'Facção Ativa' : 'Facção Inativa'}
              </span>
            </label>
            <p className="text-xs text-gray-400 mt-1.5 ml-14">
              Facções inativas não aparecem na lista na hora de criar uma nova Ordem de Produção.
            </p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-3 rounded-xl bg-[#1F3864] hover:bg-blue-800 text-white text-sm font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Salvar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
