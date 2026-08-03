import { redirect } from 'next/navigation';
import { validarResetToken } from '../actions/reset-senha';
import ResetForm from './ResetForm';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default async function RedefinirSenhaPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const params = await searchParams;
  const token = params.token;
  
  console.log('Token recebido na URL:', token);

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-xl border border-gray-100">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Link Inválido</h2>
          <p className="text-gray-600 mb-6">Nenhum token de recuperação fornecido.</p>
          <Link href="/recuperar-senha" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl w-full">
            Solicitar novo link
          </Link>
        </div>
      </div>
    );
  }

  const result = await validarResetToken(token);

  if (!result.valid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-xl border border-gray-100">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Link Inválido ou Expirado</h2>
          <p className="text-gray-600 mb-6">{result.error || 'O link de recuperação de senha não é mais válido.'}</p>
          <Link href="/recuperar-senha" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl w-full">
            Solicitar novo link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#1F3864]/5 to-transparent -z-10" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-[#1F3864] rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/20 transform -rotate-6">
            <span className="text-3xl">✂️</span>
          </div>
        </div>
        
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Crie uma nova senha
        </h2>
        <p className="mt-3 text-center text-sm text-gray-600 max-w-sm mx-auto">
          Digite sua nova senha abaixo para recuperar o acesso à sua conta.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100">
          <ResetForm token={token} />
        </div>
      </div>
    </div>
  );
}
