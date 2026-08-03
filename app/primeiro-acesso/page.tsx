'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { validateToken, finalizarCadastro } from '@/app/actions/primeiro-acesso';
import { Scissors, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

function PrimeiroAcessoContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ email: string; nome: string } | null>(null);

  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmSenha, setShowConfirmSenha] = useState(false);

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function checkToken() {
      if (!token) {
        setError('Token de acesso não fornecido.');
        setLoading(false);
        return;
      }
      
      const res = await validateToken(token);
      if (res.error) {
        setError(res.error);
      } else if (res.user) {
        setUser(res.user);
      }
      setLoading(false);
    }
    
    checkToken();
  }, [token]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    formData.append('token', token!); // garantido que existe aqui

    const result = await finalizarCadastro(formData);

    if (result.error) {
      setFormError(result.error);
      setFormLoading(false);
    } else {
      // Sucesso! Redireciona para o dashboard
      router.push('/dashboard');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Inválido</h2>
        <p className="text-gray-500 mb-8">{error}</p>
        <Link 
          href="/login" 
          className="inline-flex items-center justify-center bg-[#1F3864] hover:bg-blue-900 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Voltar para o Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bem-vindo, {user?.nome?.split(' ')[0]}!</h2>
        <p className="text-gray-500 mt-2">Falta pouco. Conclua a configuração da sua conta para acessar o sistema.</p>
      </div>

      {formError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="nome_confeccao">
            Nome da Confecção / Negócio
          </label>
          <input
            type="text"
            id="nome_confeccao"
            name="nome_confeccao"
            placeholder="Ex: Confecções Silva"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 placeholder:text-slate-400"
            required
            autoComplete="organization"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="senha">
            Crie sua Senha
          </label>
          <div className="relative">
            <input
              type={showSenha ? "text" : "password"}
              id="senha"
              name="senha"
              placeholder="Mínimo de 6 caracteres"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none pr-12 text-slate-900 placeholder:text-slate-400"
              required
              autoComplete="new-password"
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowSenha(!showSenha)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="confirmSenha">
            Confirme sua Senha
          </label>
          <div className="relative">
            <input
              type={showConfirmSenha ? "text" : "password"}
              id="confirmSenha"
              name="confirmSenha"
              placeholder="Repita a senha criada"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none pr-12 text-slate-900 placeholder:text-slate-400"
              required
              autoComplete="new-password"
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirmSenha(!showConfirmSenha)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showConfirmSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={formLoading}
          className="w-full bg-[#1F3864] hover:bg-blue-900 text-white font-bold text-lg py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-900/20 mt-2 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {formLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Entrar no Sistema <CheckCircle2 className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function PrimeiroAcessoPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header / Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 font-extrabold text-2xl text-[#1F3864]">
            <div className="w-10 h-10 bg-[#1F3864] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Scissors className="w-6 h-6 text-white" />
            </div>
            FaccioCtrl
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <Suspense fallback={
            <div className="flex items-center justify-center p-10">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          }>
            <PrimeiroAcessoContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
