'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, Users, Crown, Download, Loader2, LogOut, Eye, EyeOff } from 'lucide-react';
import { loginAdmin, getAdminData, logoutAdmin } from '@/app/actions/admin';

type UserData = {
  id: number;
  nome: string;
  nomeConfeccao: string | null;
  email: string;
  plano: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProUsers, setTotalProUsers] = useState(0);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    setLoading(true);
    const data = await getAdminData();
    if (data.authorized) {
      setAuthorized(true);
      setUsers(data.users || []);
      setTotalUsers(data.totalUsers || 0);
      setTotalProUsers(data.totalProUsers || 0);
    } else {
      setAuthorized(false);
    }
    setLoading(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('password', password);
    
    const res = await loginAdmin(formData);
    
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      await checkAuth(); // Refetch data now that cookie is set
    }
  }

  async function handleLogout() {
    await logoutAdmin();
    setAuthorized(false);
    setUsers([]);
  }

  function exportToCSV() {
    // Cabeçalhos
    const headers = ['ID', 'Nome', 'Nome Confeccao', 'E-mail', 'Plano', 'Data de Cadastro', 'Ultimo Acesso (UpdatedAt)'];
    
    // Linhas
    const rows = users.map(u => [
      u.id,
      `"${u.nome}"`,
      `"${u.nomeConfeccao || ''}"`,
      u.email,
      u.plano,
      new Date(u.createdAt).toLocaleString('pt-BR'),
      new Date(u.updatedAt).toLocaleString('pt-BR')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `faccioctrl_usuarios_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading && !authorized && !error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Painel Administrativo</h1>
          <p className="text-center text-gray-500 mb-8 text-sm">Acesso restrito. Insira a senha mestra.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha de Administrador"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all pr-12 font-medium"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm font-semibold text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Acessar Painel'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 flex items-center justify-center rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-sm text-gray-500">Visão geral dos clientes do FaccioCtrl</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 font-bold rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Total Cadastrados</p>
              <h3 className="text-3xl font-black text-gray-900">{totalUsers}</h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-50 rounded-xl flex items-center justify-center">
              <Crown className="w-7 h-7 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Ativos (Plano Pro)</p>
              <h3 className="text-3xl font-black text-gray-900">{totalProUsers}</h3>
            </div>
          </div>
        </div>

        {/* TABELA */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Usuários Cadastrados</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Confecção / Usuário</th>
                  <th className="px-6 py-4">E-mail</th>
                  <th className="px-6 py-4">Plano</th>
                  <th className="px-6 py-4">Data Cadastro</th>
                  <th className="px-6 py-4">Último Acesso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{u.nomeConfeccao || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{u.nome}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        u.plano === 'pro' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {u.plano.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(u.updatedAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
