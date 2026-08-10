import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacidadePage() {
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
          <h1 className="text-3xl font-extrabold text-[#1F3864] mb-2">Política de Privacidade — FaccioCtrl</h1>
          <p className="text-sm text-gray-500 mb-8 italic">Última atualização: 10 de agosto de 2026</p>

          <p>
            A sua privacidade é importante para nós. Esta Política de Privacidade explica como o <strong>FaccioCtrl</strong> ("nós", "nosso") coleta, usa, armazena e protege as informações pessoais dos usuários ("você") que utilizam nosso site e serviços, em conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD)</strong>.
          </p>

          <h2 className="text-xl font-bold text-[#1F3864] mt-8 mb-4">1. Quem somos (Controlador dos Dados)</h2>
          <p>O FaccioCtrl é o controlador dos dados pessoais tratados por meio deste site e dos serviços oferecidos.</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Responsável:</strong> Pedro Nicolodi Kerber</li>
            <li><strong>Contato para assuntos de privacidade:</strong> suporteplataforma.pkn@gmail.com</li>
          </ul>

          <h2 className="text-xl font-bold text-[#1F3864] mt-8 mb-4">2. Quais dados coletamos</h2>
          <p>Coletamos apenas os dados necessários para fornecer nossos serviços:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Dados de cadastro:</strong> nome e e-mail, fornecidos no momento da compra.</li>
            <li><strong>Dados de pagamento:</strong> processados diretamente pela <strong>Kiwify</strong> (nossa plataforma de pagamentos parceira) — não armazenamos número de cartão de crédito ou dados sensíveis de pagamento em nossos próprios servidores.</li>
            <li><strong>Dados de uso:</strong> informações sobre login, acesso ao painel/dashboard e histórico de compras (produto principal e upsells).</li>
            <li><strong>Comunicação:</strong> ao contratar o serviço de Configuração Expressa, seu e-mail e nome são usados para enviar um convite de contato via Telegram, para que possamos prestar o atendimento personalizado contratado.</li>
          </ul>

          <h2 className="text-xl font-bold text-[#1F3864] mt-8 mb-4">3. Como usamos seus dados</h2>
          <p>Usamos os dados coletados para:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Criar e autenticar sua conta (login via Magic Link, enviado por e-mail);</li>
            <li>Processar e confirmar suas compras (produto principal, order bumps e upsells);</li>
            <li>Liberar o acesso aos módulos contratados (ex: Módulo de Auditoria);</li>
            <li>Enviar e-mails transacionais necessários ao serviço (boas-vindas, confirmações de compra, instruções de próximos passos);</li>
            <li>Prestar suporte e atendimento, incluindo contato via Telegram quando aplicável ao plano contratado.</li>
          </ul>
          <p className="font-semibold">Não utilizamos seus dados para envio de propaganda não solicitada, nem os vendemos a terceiros.</p>

          <h2 className="text-xl font-bold text-[#1F3864] mt-8 mb-4">4. Base legal (LGPD)</h2>
          <p>Tratamos seus dados pessoais com base nas seguintes hipóteses legais previstas no art. 7º da LGPD:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Execução de contrato</strong> (art. 7º, V): para processar sua compra e fornecer o serviço contratado;</li>
            <li><strong>Consentimento</strong> (art. 7º, I): quando aplicável, ao aceitar esta política no momento do cadastro;</li>
            <li><strong>Legítimo interesse</strong> (art. 7º, IX): para envio de comunicações estritamente relacionadas ao serviço já contratado.</li>
          </ul>

          <h2 className="text-xl font-bold text-[#1F3864] mt-8 mb-4">5. Compartilhamento de dados com terceiros</h2>
          <p>Compartilhamos dados pessoais apenas com prestadores de serviço estritamente necessários à operação do FaccioCtrl:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Kiwify</strong> — processamento de pagamentos e gestão de vendas;</li>
            <li><strong>Provedor de e-mail (SMTP)</strong> — envio de e-mails transacionais (boas-vindas, confirmações);</li>
            <li><strong>Vercel</strong> — hospedagem da aplicação e infraestrutura.</li>
          </ul>
          <p>Não compartilhamos, vendemos ou alugamos seus dados pessoais para fins de marketing de terceiros. Só divulgamos informações quando exigido por lei ou ordem judicial.</p>

          <h2 className="text-xl font-bold text-[#1F3864] mt-8 mb-4">6. Retenção de dados</h2>
          <p>Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades descritas nesta política, ou conforme exigido por obrigações legais, fiscais ou contratuais.</p>

          <h2 className="text-xl font-bold text-[#1F3864] mt-8 mb-4">7. Seus direitos como titular de dados (LGPD, art. 18)</h2>
          <p>Você tem direito a, mediante solicitação:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Confirmar a existência de tratamento dos seus dados;</li>
            <li>Acessar seus dados;</li>
            <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
            <li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários;</li>
            <li>Solicitar a portabilidade dos dados;</li>
            <li>Revogar o consentimento e solicitar a exclusão dos dados tratados com base nele;</li>
            <li>Obter informações sobre com quem compartilhamos seus dados.</li>
          </ul>
          <p>Para exercer qualquer um desses direitos, entre em contato pelo e-mail: <a href="mailto:suporteplataforma.pkn@gmail.com" className="text-blue-600 hover:underline">suporteplataforma.pkn@gmail.com</a>.</p>

          <h2 className="text-xl font-bold text-[#1F3864] mt-8 mb-4">8. Segurança dos dados</h2>
          <p>Adotamos medidas técnicas e administrativas razoáveis para proteger seus dados pessoais contra acessos não autorizados, perda, alteração ou divulgação indevida, incluindo transmissão criptografada (HTTPS) e controle de acesso a variáveis sensíveis de ambiente.</p>

          <h2 className="text-xl font-bold text-[#1F3864] mt-8 mb-4">9. Cookies</h2>
          <p>Utilizamos cookies estritamente necessários ao funcionamento do site (ex: manter sua sessão de login ativa). Não utilizamos cookies de publicidade comportamental ou de rastreamento de terceiros (como Google AdSense), a menos que isso venha a mudar — nesse caso, esta política será atualizada previamente.</p>

          <h2 className="text-xl font-bold text-[#1F3864] mt-8 mb-4">10. Links para sites externos</h2>
          <p>Nosso site pode conter links para sites externos (como o checkout da Kiwify ou o Telegram). Não temos controle sobre essas plataformas e não nos responsabilizamos por suas práticas de privacidade. Recomendamos a leitura das políticas específicas de cada uma.</p>

          <h2 className="text-xl font-bold text-[#1F3864] mt-8 mb-4">11. Alterações nesta política</h2>
          <p>Podemos atualizar esta Política de Privacidade periodicamente. A data da última atualização estará sempre indicada no topo deste documento. O uso continuado do site após alterações será considerado como aceitação da nova versão.</p>

          <h2 className="text-xl font-bold text-[#1F3864] mt-8 mb-4">12. Contato</h2>
          <p>Em caso de dúvidas sobre esta Política de Privacidade ou sobre como tratamos seus dados, entre em contato: <a href="mailto:suporteplataforma.pkn@gmail.com" className="text-blue-600 hover:underline">suporteplataforma.pkn@gmail.com</a>.</p>
        </div>
      </div>
    </div>
  );
}
