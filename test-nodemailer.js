const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'suporteplataforma.pkn@gmail.com',
    pass: 'cpvzfcibsqqawxug'
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.error("Erro no verify:", error);
  } else {
    console.log("Servidor está pronto para receber nossas mensagens");
  }
});
