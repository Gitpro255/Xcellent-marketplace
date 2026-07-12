import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(to: string, name: string, code: string) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: `${code} is your Xcellent verification code`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color:#1F3A2E;">Welcome to Xcellent, ${name.split(" ")[0]}</h2>
        <p>Enter this code to verify your email address:</p>
        <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; background:#F6E7D3; color:#B9722F; padding: 16px; text-align:center; border-radius: 8px; margin: 16px 0;">
          ${code}
        </div>
        <p style="color:#6b6f63; font-size: 13px;">This code expires in 15 minutes. If you didn't create an Xcellent account, you can ignore this email.</p>
      </div>
    `,
  });
}

export async function sendOrderConfirmationEmail(to: string, orderId: string, total: string) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: `Your Xcellent order ${orderId} is confirmed`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color:#1F3A2E;">Order confirmed</h2>
        <p>Your order <strong>${orderId}</strong> for <strong>${total}</strong> has been placed. We'll email you again once it ships.</p>
      </div>
    `,
  });
}
