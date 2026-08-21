import { CheckCircle2, Clock, AlertTriangle, TrendingDown, CircleDollarSign } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function FuncionalidadesSection() {
  return (
    <section id="funcionalidades" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-32">
        
        {/* Funcionalidade 1 */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <ScrollReveal>
              <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
                Nunca mais pergunte onde está um pedido.
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Visualize todas as suas ordens de produção em um painel inteligente. O FaccioCtrl colore e classifica automaticamente cada lote de acordo com o prazo, para que você saiba exatamente o que precisa de atenção, sem precisar abrir planilhas ou rolar conversas.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 font-medium text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" /> Status coloridos automáticos
                </li>
                <li className="flex items-center gap-3 font-medium text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" /> Busca rápida por referência
                </li>
              </ul>
            </ScrollReveal>
          </div>
          <div className="flex-1 w-full relative">
            <ScrollReveal delay={200} className="relative z-10">
              <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 shadow-2xl shadow-blue-900/10 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
                  <div className="font-bold text-gray-800">Painel de Ordens</div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
                    <div>
                      <div className="font-bold text-gray-900">OP #1024 - Camisas Polo</div>
                      <div className="text-xs text-gray-500">Oficina Silva • 500 peças</div>
                    </div>
                    <span className="px-3 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> NO PRAZO
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-red-100 flex items-center justify-between shadow-sm ring-1 ring-red-50">
                    <div>
                      <div className="font-bold text-gray-900">OP #1025 - Calças Jeans</div>
                      <div className="text-xs text-gray-500">Costura Express • 200 peças</div>
                    </div>
                    <span className="px-3 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" /> ATRASADA
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm opacity-50">
                    <div>
                      <div className="font-bold text-gray-900">OP #1023 - Regatas</div>
                      <div className="text-xs text-gray-500">Facção Central • 1000 peças</div>
                    </div>
                    <span className="px-3 py-1 text-xs font-bold bg-gray-100 text-gray-600 rounded-full">
                      ENTREGUE
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100 rounded-full blur-[100px] -z-10"></div>
          </div>
        </div>

        {/* Funcionalidade 2 */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          <div className="flex-1 w-full relative">
            <ScrollReveal delay={200} className="relative z-10">
              <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 shadow-2xl shadow-indigo-900/10 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
                  <div className="font-bold text-gray-800">Desempenho das Facções</div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-bold text-gray-900">Costura Express</div>
                      <div className="text-red-600 font-bold text-xl flex items-center gap-1">
                        45% <TrendingDown className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>Volume: 5.000 peças</span>
                      <span className="text-red-500 font-medium">Taxa de Atraso Alta</span>
                    </div>
                  </div>
                  
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-bold text-gray-900">Oficina Silva</div>
                      <div className="text-green-600 font-bold text-xl flex items-center gap-1">
                        5%
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>Volume: 12.000 peças</span>
                      <span className="text-green-600 font-medium">Excelente</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-100 rounded-full blur-[100px] -z-10"></div>
          </div>
          <div className="flex-1">
            <ScrollReveal>
              <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
                Saiba qual facção atrasa mais.
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Tome decisões baseadas em dados reais, não em achismos. O sistema gera um ranking automático mostrando a taxa de atraso de cada parceiro, ajudando você a escolher melhor quem vai costurar a próxima coleção.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 font-medium text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" /> Histórico de performance
                </li>
                <li className="flex items-center gap-3 font-medium text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" /> Visão clara de confiabilidade
                </li>
              </ul>
            </ScrollReveal>
          </div>
        </div>

        {/* Funcionalidade 3 */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <ScrollReveal>
              <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
                Seja avisado antes do prazo estourar.
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Um painel que avisa você proativamente sobre as ordens que estão perigosamente perto da data de entrega, permitindo que você cobre a facção antes do prazo vencer.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 font-medium text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-amber-500" /> OPs em risco (2 dias para o fim)
                </li>
                <li className="flex items-center gap-3 font-medium text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-amber-500" /> Aja de forma preventiva
                </li>
              </ul>
            </ScrollReveal>
          </div>
          <div className="flex-1 w-full relative">
            <ScrollReveal delay={200} className="relative z-10">
              <div className="bg-[#1F3864] border border-blue-900 rounded-3xl p-6 shadow-2xl shadow-blue-900/40 transform rotate-1 hover:rotate-0 transition-transform duration-500 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-amber-500 rounded-2xl shadow-lg shadow-amber-500/30">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Atenção Necessária</h4>
                    <p className="text-blue-200 text-sm">3 lotes vencem nas próximas 48h</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-bold">Bermudas Sarja</div>
                      <div className="text-xs text-blue-200">Vence AMANHÃ</div>
                    </div>
                    <button className="px-4 py-2 bg-white text-[#1F3864] text-xs font-bold rounded-lg shadow-sm">
                      Cobrar Facção
                    </button>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-bold">Jaquetas Inverno</div>
                      <div className="text-xs text-blue-200">Vence em 2 dias</div>
                    </div>
                    <button className="px-4 py-2 bg-white text-[#1F3864] text-xs font-bold rounded-lg shadow-sm">
                      Cobrar Facção
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-amber-100 rounded-full blur-[100px] -z-10"></div>
          </div>
        </div>

        {/* Funcionalidade 4 - Financeiro */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          <div className="flex-1 w-full relative">
            <ScrollReveal delay={200} className="relative z-10">
              <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 shadow-2xl shadow-emerald-900/10 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
                  <div className="font-bold text-gray-800">Controle Financeiro</div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-bold text-gray-900">Total a Receber</div>
                      <div className="text-green-600 font-bold text-xl flex items-center gap-1">
                        R$ 15.420,00
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>Vendas e Faturamento</span>
                      <span className="text-green-600 font-medium">Em dia</span>
                    </div>
                  </div>
                  
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-bold text-gray-900">Total a Pagar</div>
                      <div className="text-red-600 font-bold text-xl flex items-center gap-1">
                        R$ 3.850,00
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>Pagamentos a Facções</span>
                      <span className="text-red-600 font-medium">Próximos 30 dias</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-100 rounded-full blur-[100px] -z-10"></div>
          </div>
          <div className="flex-1">
            <ScrollReveal>
              <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
                Controle financeiro integrado.
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Tudo no mesmo lugar. Registre facilmente os pagamentos que você precisa fazer para as facções e o faturamento das suas vendas. Tenha uma visão clara do seu saldo e nunca mais perca o controle do caixa da confecção.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 font-medium text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Contas a pagar e receber
                </li>
                <li className="flex items-center gap-3 font-medium text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Vinculado à sua produção
                </li>
              </ul>
            </ScrollReveal>
          </div>
        </div>

      </div>
    </section>
  );
}
