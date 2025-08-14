const {Resend} = require('resend');
const resend = new Resend("re_PpCgJWjQ_2UzbQTsGWHX5y3Fqs1Q7SiH3");

console.log('Resend initialized with API key:', resend);

async function sendEmail(to, subject, text) {
    await resend.emails.send({
        from: "AuroCore <noreply@aurocore.com>",
        to,
        subject,
        text
    });
}

module.exports = sendEmail;