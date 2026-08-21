'use client';

import { useState, useTransition, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { createTransacao } from '@/app/actions/financeiro';
import { getFaccoes } from '@/app/actions/faccoes';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export function TransacaoModal({ onClose, onSuccess }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [faccoes, setFaccoes] = useState<{id: number, nome: string}[]>([]);

  useEffect(() => {
    // Busca facções para popular o select
    getFaccoes().then((data) => {
      if (Array.isArray(data)) {
        setFaccoes(data);
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await createTransacao(formData);
      if (result.error) {
        setError(result.error);
      } else {
        onSuccess();
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Novo Lançamento</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Tipo</label>
              <select 
                name="tipo" 
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium transition-all"
              >
                <option value="SAIDA">Saída (A Pagar)</option>
                <option value="ENTRADA">Entrada (A Receber)</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Valor (R$)</label>
              <input 
                type="number" 
                name="valor" 
                step="0.01"
                min="0.01"
                required
                placeholder="0,00"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Categoria</label>
            <input 
              type="text" 
              name="categoria" 
              required
              placeholder="Ex: Pagamento Facção, Recebimento Cliente..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Vínculo com Facção (Opcional)</label>
            <select 
              name="faccaoId" 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium transition-all"
            >
              <option value="">Nenhuma</option>
              {faccoes.map(f => (
                <option key={f.id} value={f.id}>{f.nome}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Data de Vencimento</label>
              <input 
                type="date" 
                name="dataVencimento"
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Forma de Pagamento (Opcional)</label>
              <input 
                type="text" 
                name="formaPagamento"
                placeholder="Ex: PIX, Boleto"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Descrição (Opcional)</label>
            <textarea 
              name="descricao" 
              rows={2}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1F3864] text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Salvar Lançamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
