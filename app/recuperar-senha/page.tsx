'use client';

import { useState } from 'react';
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { solicitarRecuperacao } from '../actions/reset-senha';

export default function RecuperarSenhaPage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const formData = new FormData(e.currentTarget);
    const res = await solicitarRecuperacao(formData);
    setLoading(false);

    if (res.error) {
      setMsg({ type: 'error', text: res.error });
    } else {
      setMsg({ type: 'success', text: 'Se o e-mail existir em nossa base, um link de recuperação foi enviado. Verifique sua caixa de entrada e spam.' });
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#1F3864]/5 to-transparent -z-10" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-48 -left-24 w-72 h-72 bg-[#1F3864]/5 rounded-full blur-3xl -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-[#1F3864] rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/20 transform -rotate-6">
            <span className="text-3xl">✂️</span>
          </div>
        </div>
        
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Esqueceu sua senha?
        </h2>
        <p className="mt-3 text-center text-sm text-gray-600 max-w-sm mx-auto">
          Não se preocupe! Informe seu e-mail abaixo e enviaremos um link para você redefinir sua senha.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {msg && (
              <div className={`p-4 rounded-xl flex items-start gap-3 text-sm ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                E-mail cadastrado
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="exemplo@email.com"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1F3864] hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-900/30 flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar link de recuperação'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-gray-600">
            <Link href="/login" className="text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
