const nodemailer =  require('nodemailer');

// Looking to send emails in production? Check out our Email API/SMTP product!
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "0e7b5175d3265e",
      pass: "326aa3eea7dced"
    }
  });

  

module.exports = transporter;

