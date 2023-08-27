import * as nodemailer from 'nodemailer'

export const sendEmailNotification = async (
  name: string,
  url: string,
  toEmail: string
): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: Number(process.env.NODEMAILER_PORT),
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: process.env.NODEMAILER_FROM,
      to: toEmail,
      subject: `🔴 ${name} Ping failed`,
      text: `uptime Status Ping failed for ${url}`,
      html: `uptime Status Ping failed for ${url}`,
    })
  } catch (err: unknown) {
    console.log(`Failed to send email: ${err}`)
  }
}
