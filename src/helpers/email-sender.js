const nodemailer = require("nodemailer");
const {
    MAIL_USER,
    MAIL_PORT,
    MAIL_SERVICE,
    MAIL_PASSWORD
} = require('../config/config')
const transporter = nodemailer.createTransport({
    service: MAIL_SERVICE,
    port: MAIL_PORT,
    user: MAIL_USER,
    secure: true,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
    },
});

const sendMail = async (to = MAIL_USER, subject = '', html = '', attachments = null) => await transporter.sendMail({
    from: "cursocoder.mig@gmail.com",
    to: to || "cursocoder.mig@gmail.com",
    subject: subject || "Sujeto de Ejemplo",
    html: html || `
        <div>
          <h1>Solicitud de Restablecimiento de Contraseña</h1>
          <p>Se creo una nueva solicitud de restablecimiento de contraseña para la cuenta registrada con el mail ${to}</p>
          <p>Para crear una nueva contraseña, ingresar al sigiente link: <a href="http://localhost:5000/api/v1/session/restorePassword">Restablecer Contraseña</a></p>
          <p>Muchas gracias!</p>
        </div>
        `,
    attachments: attachments
});

module.exports = sendMail