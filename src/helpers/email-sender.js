const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    user: "cursocoder.mig@gmail.com",
    secure: true,
    auth: {
        user: "cursocoder.mig@gmail.com",
        pass: "zsjkgkqadqrrvzrv",
    },
});

const sendMail = async (to = "cursocoder.mig@gmail.com", subject = '', html = '', attachments = null) => await transporter.sendMail({
    from: "cursocoder.mig@gmail.com",
    to: to || "cursocoder.mig@gmail.com",
    subject: subject || "Restablecer Contraseña",
    html: html || `
        <div>
          <h1>Solicitud de Restablecimiento de Contraseña</h1>
          <p>Se creo una nueva solicitud de restablecimiento de contraseña para la cuenta registrada con el mail ${to}</p>
          <p>Para crear una nueva contraseña, ingresar al sigiente link: <a href="/api/v1/session/restorePassword">Restablecer Contraseña</a></p>
          <p>Muchas gracias!</p>
        </div>
        `,
    attachments: attachments
});

module.exports = sendMail