import nodeMailer from 'nodemailer';

export async function getMailClient() {
  
  const account = await nodeMailer.createTestAccount();

  const transporter = nodeMailer.createTransport({
    host:'smtp.ethereal.email',
    port:587,
    secure:false,
    auth: {
      user: account.user,
      pass: account.pass,
    }
  })


  return transporter
}