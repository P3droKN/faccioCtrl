require('dotenv').config();
const { sendMagicLinkEmail } = require('./lib/utils/mailer_test_wrapper');

async function testEmail() {
  console.log('Testing SMTP with following config:');
  console.log('SMTP_HOST:', process.env.SMTP_HOST);
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('SMTP_PORT:', process.env.SMTP_PORT);
  
  const success = await sendMagicLinkEmail('pedronicolodikerber06@gmail.com', 'test-token-12345');
  console.log('Email sent successfully?', success);
}

testEmail();
