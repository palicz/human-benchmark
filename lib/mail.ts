import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendVerificationEmail = async (
    email: string, 
    token: string
) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: "verification@realpalicz.tech",
        to: email,
        subject: "Email megerősítése",
        html: `<p>Kattints <a href="${confirmLink}">ide</a> az email címed megerősítéséhez.</p>`
    })
}

export const sendPasswordResetEmail = async (
    email: string, 
    token: string
) => {
    const resetLink = `${domain}/auth/new-password?token=${token}`;

    await resend.emails.send({
        from: "password@realpalicz.tech",
        to: email,
        subject: "Jelszó megváltoztatása",
        html: `<p>Kattints <a href="${resetLink}">ide</a> a jelszavad megváltoztatásához.</p>`
    })
}