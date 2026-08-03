'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { redefinirSenha } from '../actions/reset-senha';
import Link from 'next/link';

export default function ResetForm({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmSenha, setShowConfirmSenha] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const formData = new FormData(e.currentTarget);
    const res = await redefinirSenha(formData);
    setLoading(false);

    if (res.error) {
      setMsg({ type: 'error', text: res.error });
    } else {
      setMsg({ type: 'success', text: 'Senha alterada com sucesso! Redirecionando para o login...' });
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  if (msg?.type === 'success') {
    return (
      <div className="text-center py-4">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Tudo certo!</h3>
        <p className="text-gray-600 mb-6">{msg.text}</p>
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <input type="hidden" name="token" value={token} />

      {msg && (
        <div className={`p-4 rounded-xl flex items-start gap-3 text-sm bg-red-50 text-red-700`}>
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{msg.text}</p>
        </div>
      )}

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
            placeholder="Mínimo 8 caracteres"
            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 pr-12"
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
            placeholder="Repita a nova senha"
            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 pr-12"
          />
          <button type="button" onClick={() => setShowConfirmSenha(!showConfirmSenha)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showConfirmSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#1F3864] hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-900/30 flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar Nova Senha'}
      </button>
      
      <div className="text-center mt-6">
        <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-gray-700">
          Cancelar e voltar ao login
        </Link>
      </div>
    </form>
  );
}
