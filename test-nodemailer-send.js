const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'suporteplataforma.pkn@gmail.com',
    pass: 'cpvzfcibsqqawxug',
  },
});

transporter.sendMail({
  from: 'suporteplataforma.pkn@gmail.com',
  to: 'teste@example.com',
  subject: 'Test',
  text: 'Test'
}).then(info => console.log('Success:', info.messageId))
  .catch(err => console.error('EXACT SMTP ERROR:', err));
