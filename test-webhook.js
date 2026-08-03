const email = process.argv[2];

if (!email) {
  console.error('Por favor, informe seu e-mail como argumento.');
  console.log('Uso: node test-webhook.js SEU_EMAIL@GMAIL.COM');
  process.exit(1);
}

const payload = {
  webhook_event_type: 'order_approved',
  Customer: {
    email: email,
    full_name: 'Usuário Teste Kiwify'
  },
  Subscription: {
    id: 'sub_' + Math.random().toString(36).substring(7),
    next_payment: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
  }
};

async function run() {
  console.log(`Disparando webhook falso para o e-mail: ${email}...`);
  try {
    const res = await fetch('http://localhost:3000/api/webhook/kiwify?signature=teste123secreto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (res.ok) {
      console.log('✅ Webhook processado com sucesso pelo servidor (Status 200).');
      console.log('Verifique sua caixa de entrada (e spam) para conferir o e-mail de Primeiro Acesso!');
    } else {
      console.error('❌ Falha ao processar webhook. Status Code:', res.status);
      const text = await res.text();
      console.error('Resposta do servidor:', text);
    }
  } catch (err) {
    console.error('❌ Erro de rede ou servidor fora do ar.', err.message);
    console.log('Dica: Certifique-se de que o servidor do Next.js (npm run dev) esteja rodando em outra janela do terminal.');
  }
}

run();
