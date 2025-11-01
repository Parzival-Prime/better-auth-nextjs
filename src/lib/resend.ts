import { NextResponse } from "next/server";
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY);

const styles = {
    container: "max-width:500px;margin:20px auto;padding:20px;border:1px solid #DDD;border-radius:6px;",
    heading: "font-size:20px;color:#333;",
    paragraph: "font-size:16px;",
    link: "display:inline-block;margin-top:15px;padding:10px 15px;background:#D07BFF;color:#FFF;text-decoration:none;border-radius:4px;",
}

export default async function sendMail(
    { email, subject, message, url }:{email: string, subject: string, message: string, url: string}
) {
    try {
        const data = await resend.emails.send({
            from: `Better Auth App <onboarding@resend.dev>`,
            to: [email],
            subject: `Better Auth App - ${subject}`,
            html: `
                <div style="${styles.container}">
                    <h1 style="${styles.heading}">${subject}</h1>
                    <p style="${styles.paragraph}">${message}</p>
                    <a href="${url}"><button>Verify</button></a>
                </div>
            `,
        })

        return NextResponse.json({ success: true, data }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ success: false, err }, { status: 500 })
    }
} 