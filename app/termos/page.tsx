import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      <div className="max-w-4xl mx-auto w-full px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a página inicial
          </Link>
        </div>
        
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 prose prose-blue max-w-none">
          <h1 className="text-3xl font-extrabold text-[#1F3864] mb-2">Termos de Uso — FaccioCtrl</h1>
          <p className="text-sm text-gray-500 mb-8 italic">Última atualização: 10 de agosto de 2026</p>

          <h2 className="text-xl font-bold text-[#1F3864] mt-8 mb-4">1. Aceitação dos Termos</h2>
          <p>Ao acessar ou utilizar o site e os serviços do FaccioCtrl, você concorda com estes Termos de Uso e com nossa Política de Privacidade. Caso não concorde com algum destes termos, você não deve utilizar nossos serviços.</p>

          <h2 className="text-xl font-bold text-[#1F3864] mt-8 mb-4">2. Descrição do serviço</h2>
          <p>O FaccioCtrl é uma plataforma de gestão voltada para facções têxteis (unidades de produção terceirizada no setor de confecção), oferecendo ferramentas de controle de pedidos, contratos, checklists de qualidade e comunicação entre confecções e suas facções parceiras, incluindo, conforme o plano contratado, acesso a módulos adicionais como Configuração Expressa e Auditoria.</p>

          <h2 className="text-xl font-bold text-[#1F3864] mt-8 mb-4">3. Licença de uso</h2>
          <p>Concedemos a você uma licença limitada, pessoal, não exclusiva e intransferível para utilizar o FaccioCtrl de acordo com o plano contratado. Você não pode:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Copiar, modificar ou redistribuir o sistema ou seu conteúdo;</li>
            <li>Utilizar o serviço para fins ilegais ou não autorizados;</li>
            <li>Tentar realizar engenharia reversa, descompilar ou extrair o código-fonte da aplicação;</li>
            <li>Compartilhar suas credenciais de acesso com terceiros não autorizados.</li>
          </ul>
          <p>Esta licença é automaticamente encerrada em caso de violação destes termos, ou pode ser revogada pelo FaccioCtrl a qualquer momento, mediante aviso.</p>

          <h2 className="text-xl font-bold text-[#1F3864] mt-8 mb-4">4. Compromisso do usuário</h2>
          <p>Ao utilizar o FaccioCtrl, você se compromete a:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Não se envolver em atividades ilegais ou que violem direitos de terceiros;</li>
            <li>Não utilizar o serviço para disseminar conteúdo discriminatório, ilegal ou que viole direitos humanos;</li>
            <li>Não tentar comprometer a segurança, disponibilidade ou integridade da plataforma (incluindo tentativas de invasão, disseminação de vírus ou ataques de negação de serviço).</li>
          </ul>

          <h2 className="text-xl font-bold text-[#1F3864] mt-8 mb-4">5. Pagamentos e reembolsos</h2>
          <p>Os pagamentos são processados pela plataforma parceira <strong>Kiwify</strong>. Condições de reembolso seguem a política vigente da Kiwify e a legislação brasileira aplicável, incluindo o direito de arrependimento previsto no art. 49 do Código de Defesa do Consumidor para compras realizadas fora do estabelecimento comercial (ex: internet), dentro do prazo de 7 dias corridos a partir da compra.</p>

          <h2 className="text-xl font-bold text-[#1F3864] mt-8 mb-4">6. Isenção de responsabilidade</h2>
          <p>O FaccioCtrl é fornecido "como está". Não garantimos que o serviço estará livre de erros, interrupções ou indisponibilidades, embora nos esforcemos para manter a melhor experiência possível. Não nos responsabilizamos por danos indiretos decorrentes do uso ou impossibilidade de uso do serviço, exceto nos casos previstos em lei.</p>

          <h2 className="text-xl font-bold text-[#1F3864] mt-8 mb-4">7. Modificações nos termos</h2>
          <p>Podemos revisar estes Termos de Uso a qualquer momento. O uso continuado do serviço após alterações implica na aceitação da versão vigente.</p>

          <h2 className="text-xl font-bold text-[#1F3864] mt-8 mb-4">8. Lei aplicável e foro</h2>
          <p>Estes Termos de Uso são regidos pelas leis da <strong>República Federativa do Brasil</strong>. Fica eleito o foro da comarca de Pedro Nicolo Dikerber (sua cidade/estado) para dirimir quaisquer controvérsias decorrentes destes termos, com renúncia a qualquer outro, por mais privilegiado que seja.</p>

          <h2 className="text-xl font-bold text-[#1F3864] mt-8 mb-4">9. Contato</h2>
          <p>Dúvidas sobre estes Termos de Uso podem ser enviadas para: <a href="mailto:suporteplataforma.pkn@gmail.com" className="text-blue-600 hover:underline">suporteplataforma.pkn@gmail.com</a>.</p>
        </div>
      </div>
    </div>
  );
}
