'use client';

import { useState, useRef } from 'react';
import { User, Lock, CreditCard, Upload, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { atualizarDadosConta, alterarSenha } from '../actions/perfil';
import { useRouter } from 'next/navigation';

export default function PerfilTabs({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<'conta' | 'seguranca' | 'plano'>('conta');
  const router = useRouter();

  // Tab 1: Conta States
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [contaLoading, setContaLoading] = useState(false);
  const [contaMsg, setContaMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Tab 2: Segurança States
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmSenha, setShowConfirmSenha] = useState(false);
  const [segLoading, setSegLoading] = useState(false);
  const [segMsg, setSegMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Tab 3: Plano States
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setContaMsg({ type: 'error', text: 'A imagem deve ter no máximo 2MB.' });
        return;
      }
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleContaSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContaLoading(true);
    setContaMsg(null);
    const formData = new FormData(e.currentTarget);
    const res = await atualizarDadosConta(formData);
    setContaLoading(false);
    if (res.error) {
      setContaMsg({ type: 'error', text: res.error });
    } else {
      setContaMsg({ type: 'success', text: 'Dados atualizados com sucesso!' });
      router.refresh();
    }
  };

  const handleSegurancaSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSegLoading(true);
    setSegMsg(null);
    const formData = new FormData(e.currentTarget);
    const res = await alterarSenha(formData);
    setSegLoading(false);
    if (res.error) {
      setSegMsg({ type: 'error', text: res.error });
    } else {
      setSegMsg({ type: 'success', text: 'Senha alterada com sucesso!' });
      (e.target as HTMLFormElement).reset();
    }
  };

  const isPlanoAtivo = user.plano === 'pro' || user.plano === 'free'; // based on active status
  const isCancelado = user.plano === 'cancelado';
  const isPendente = user.plano === 'pendente';
  // Attempt to guess if it's monthly or annual based on previous events, but we don't store plan type explicitly.
  // The webhook stores 'pro'. We can check the difference between createdAt and nextPayment maybe? 
  // For the UI, we just display the status.
  const nextPaymentDate = user.nextPayment ? new Date(user.nextPayment).toLocaleDateString('pt-BR') : null;

  return (
    <div>
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('conta')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'conta' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <User className="w-4 h-4" /> Dados da Conta
        </button>
        <button
          onClick={() => setActiveTab('seguranca')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'seguranca' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Lock className="w-4 h-4" /> Segurança
        </button>
        <button
          onClick={() => setActiveTab('plano')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'plano' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <CreditCard className="w-4 h-4" /> Meu Plano
        </button>
      </div>

      <div className="p-6 md:p-8">
        {activeTab === 'conta' && (
          <form onSubmit={handleContaSubmit} className="space-y-6 max-w-xl">
            {contaMsg && (
              <div className={`p-4 rounded-xl flex items-center gap-3 text-sm ${contaMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {contaMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                {contaMsg.text}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Foto de Perfil</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-2xl font-bold overflow-hidden border-2 border-gray-100 shrink-0">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user.nome.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="w-4 h-4" /> Escolher imagem
                  </button>
                  <p className="text-xs text-gray-500 mt-2">JPG ou PNG. Máximo 2MB.</p>
                  <input
                    type="file"
                    name="avatar"
                    accept="image/png, image/jpeg, image/jpg"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="nome">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  defaultValue={user.nome}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="nomeConfeccao">
                  Nome da Confecção
                </label>
                <input
                  type="text"
                  id="nomeConfeccao"
                  name="nomeConfeccao"
                  defaultValue={user.nomeConfeccao || ''}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="email">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={user.email}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="whatsapp">
                  WhatsApp / Telefone (Opcional)
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  defaultValue={user.whatsapp || ''}
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={contaLoading}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {contaLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar Alterações'}
            </button>
          </form>
        )}

        {activeTab === 'seguranca' && (
          <form onSubmit={handleSegurancaSubmit} className="space-y-6 max-w-sm">
            {segMsg && (
              <div className={`p-4 rounded-xl flex items-center gap-3 text-sm ${segMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {segMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                {segMsg.text}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="senhaAtual">
                Senha Atual
              </label>
              <div className="relative">
                <input
                  type={showSenhaAtual ? "text" : "password"}
                  id="senhaAtual"
                  name="senhaAtual"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 pr-12"
                />
                <button type="button" onClick={() => setShowSenhaAtual(!showSenhaAtual)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showSenhaAtual ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="novaSenha">
                Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showNovaSenha ? "text" : "password"}
                  id="novaSenha"
                  name="novaSenha"
                  required
                  minLength={8}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 pr-12"
                />
                <button type="button" onClick={() => setShowNovaSenha(!showNovaSenha)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showNovaSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="confirmSenha">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmSenha ? "text" : "password"}
                  id="confirmSenha"
                  name="confirmSenha"
                  required
                  minLength={8}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 pr-12"
                />
                <button type="button" onClick={() => setShowConfirmSenha(!showConfirmSenha)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirmSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={segLoading}
              className="flex items-center justify-center w-full gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {segLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Alterar Senha'}
            </button>
          </form>
        )}

        {activeTab === 'plano' && (
          <div className="max-w-xl">
            {isCancelado ? (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-red-900 mb-2">Assinatura Cancelada</h3>
                <p className="text-red-700 mb-6">
                  Sua assinatura foi cancelada. Reative para continuar usando o FaccioCtrl.
                </p>
                <a
                  href="https://pay.kiwify.com.br/UiNSqS2"
                  className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
                >
                  Reativar Assinatura
                </a>
              </div>
            ) : isPendente ? (
              <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-yellow-900 mb-2">Assinatura Pendente</h3>
                <p className="text-yellow-700 mb-6">
                  Finalize seu cadastro e assinatura para começar a usar.
                </p>
                <a
                  href="https://pay.kiwify.com.br/UiNSqS2"
                  className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-xl transition-colors"
                >
                  Finalizar Assinatura
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                  <div>
                    <h3 className="font-bold text-[#1F3864] text-lg">Assinatura Ativa</h3>
                    {nextPaymentDate && (
                      <p className="text-sm text-blue-700 mt-1">Próxima cobrança: {nextPaymentDate}</p>
                    )}
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-blue-600" />
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-2">Migrar para o Plano Anual</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Economize R$147,00 por ano e garanta tranquilidade a longo prazo.
                  </p>
                  <a
                    href="https://pay.kiwify.com.br/bAH6nkn"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors mb-3"
                  >
                    Migrar Agora
                  </a>
                  <p className="text-xs text-gray-500 flex items-start gap-1">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Ao migrar, cancele seu plano mensal atual para evitar cobrança duplicada.
                  </p>
                </div>

                <button
                  onClick={() => setShowCancelModal(true)}
                  className="text-red-600 font-medium text-sm hover:underline p-2"
                >
                  Cancelar Assinatura
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Tem certeza?</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Você perderá acesso ao final do período pago. Se desejar continuar, terá que assinar novamente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 rounded-xl transition-colors"
              >
                Voltar
              </button>
              <a
                href="https://kiwify.com.br" // Or the exact Kiwify customer portal URL if known
                target="_blank"
                rel="noreferrer"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-xl transition-colors"
              >
                Confirmar
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
