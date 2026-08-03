'use client';

import { useState, useTransition } from 'react';
import { X, Loader2, Package, AlertCircle } from 'lucide-react';
import { createOrdem, updateOrdem } from '@/app/actions/ordens';
import type { OrdemComCalculo } from '@/app/actions/ordens';

interface FaccaoOption {
  id: number;
  nome: string;
}

interface OrdemModalProps {
  modo: 'criar' | 'editar';
  faccoes?: FaccaoOption[];
  ordem?: OrdemComCalculo;
  onClose: () => void;
  onSuccess: () => void;
}

export function OrdemModal({ modo, faccoes = [], ordem, onClose, onSuccess }: OrdemModalProps) {
  const [erro, setErro] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result =
        modo === 'criar'
          ? await createOrdem(formData)
          : await updateOrdem(ordem!.id, formData);

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
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {modo === 'criar' ? 'Nova Ordem de Produção' : 'Editar Ordem'}
              </h2>
              {modo === 'editar' && ordem && (
                <p className="text-xs text-gray-500">OP #{ordem.numeroOrdem}</p>
              )}
            </div>
          </div>
          <button
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

          {/* ── Campos somente no modo Criar ── */}
          {modo === 'criar' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls} htmlFor="numeroOrdem">Nº Ordem *</label>
                  <input
                    id="numeroOrdem"
                    name="numeroOrdem"
                    type="text"
                    className={inputCls}
                    placeholder="Ex: OP-001"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls} htmlFor="produto">Produto *</label>
                  <input
                    id="produto"
                    name="produto"
                    type="text"
                    className={inputCls}
                    placeholder="Ex: Camiseta Polo"
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelCls} htmlFor="faccaoId">Facção *</label>
                <select
                  id="faccaoId"
                  name="faccaoId"
                  className={inputCls}
                  required
                  defaultValue=""
                >
                  <option value="" disabled>Selecione uma facção...</option>
                  {faccoes.length === 0 ? (
                    <option disabled>Nenhuma facção cadastrada</option>
                  ) : (
                    faccoes.map((f) => (
                      <option key={f.id} value={f.id}>{f.nome}</option>
                    ))
                  )}
                </select>
                {faccoes.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1.5">
                    Cadastre ao menos uma facção antes de criar uma ordem.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls} htmlFor="dataEnvio">Data de Envio *</label>
                  <input
                    id="dataEnvio"
                    name="dataEnvio"
                    type="date"
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls} htmlFor="prazoAcordado">Prazo Acordado *</label>
                  <input
                    id="prazoAcordado"
                    name="prazoAcordado"
                    type="date"
                    className={inputCls}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelCls} htmlFor="qtdEnviada">Quantidade Enviada *</label>
                <input
                  id="qtdEnviada"
                  name="qtdEnviada"
                  type="number"
                  min={1}
                  step={1}
                  className={inputCls}
                  placeholder="Ex: 150"
                  required
                />
              </div>
            </>
          )}

          {/* ── Campos somente no modo Editar ── */}
          {modo === 'editar' && ordem && (
            <>
              {/* Infos somente-leitura */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-2xl text-sm">
                <div>
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide block mb-0.5">Produto</span>
                  <span className="font-medium text-gray-800">{ordem.produto}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide block mb-0.5">Facção</span>
                  <span className="font-medium text-gray-800">{ordem.faccaoNome}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide block mb-0.5">Qtd Enviada</span>
                  <span className="font-medium text-gray-800">{ordem.qtdEnviada}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide block mb-0.5">Prazo</span>
                  <span className="font-medium text-gray-800">
                    {new Date(ordem.prazoAcordado).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>

              <div>
                <label className={labelCls} htmlFor="qtdRetornada">
                  Quantidade Retornada *
                  <span className="ml-1 text-gray-400 normal-case font-normal">(máx. {ordem.qtdEnviada})</span>
                </label>
                <input
                  id="qtdRetornada"
                  name="qtdRetornada"
                  type="number"
                  min={0}
                  max={ordem.qtdEnviada}
                  step={1}
                  defaultValue={ordem.qtdRetornada}
                  className={inputCls}
                  required
                />
              </div>
            </>
          )}

          {/* Observação — disponível em ambos os modos */}
          <div>
            <label className={labelCls} htmlFor="observacao">Observação</label>
            <textarea
              id="observacao"
              name="observacao"
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Informações adicionais sobre a ordem..."
              defaultValue={ordem?.observacao ?? ''}
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending || (modo === 'criar' && faccoes.length === 0)}
              className="flex-1 py-3 rounded-xl bg-[#1F3864] hover:bg-blue-800 text-white text-sm font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : modo === 'criar' ? (
                'Criar Ordem'
              ) : (
                'Salvar Alterações'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
