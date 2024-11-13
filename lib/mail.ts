import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
    email: string, 
    token: string
) => {
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: "human-benchmark@resend.dev",
        to: email,
        subject: "Email megerősítése",
        html: `<p>Kattints <a href="${confirmLink}">ide</a> az email címed megerősítéséhez.</p>`
    })
}