import sgMail from '@sendgrid/mail';

/**
 *
 * @param {*} { email, name, token, confirmationCode }
 * @description Genera un email de confirmacion de cuenta
 * @example emailRegister({
 *  email: 'white@gmail.com',
 *  name: 'White Code',
 *  token: 'SDAS213123QWEWQ213133123.SDF12123.AW',
 *  confirmationCode: '5X8H3'
 * })
 * @returns {boolean} true o false
 */

export const emailRegister = async ({ email, name, token, confirmationCode }) => {
  const HTML = `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Confirmar Cuenta</title>
      <style>
        body {
          color-scheme: dark !important;
          margin: 0;
          padding: 0;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
            sans-serif;
        }
        .card {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
            sans-serif;
          background-color: #db2777 !important;
          color: #fff !important;
          padding: 30px;
        }
  
        .container {
          margin: 0 auto;
          background-color: #2a2a2a !important;
          padding: 20px 30px;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          max-width: 400px;
          text-align: center;
          margin-bottom: 0;
        }
  
        h2 {
          color: #f453a4 !important; /* Pink */
        }
  
        p {
          color: #ccc !important;
          margin-bottom: 20px;
        }
  
        code {
          display: inline-block !important;
          background-color: #3e3e3e !important;
          padding: 10px 18px;
          border-radius: 4px;
          font-family: Monaco, monospace;
          font-size: 20px;
          color: #fff !important;
        }
  
        .boton {
          width: fit-content !important;
          margin-left: auto !important;
          margin-right: auto !important;
          background-color: #ff42a1 !important; /* Pink */
          color: #fff !important;
          padding: 12px 24px !important;
          border: none !important;
          border-radius: 6px !important;
          cursor: pointer !important;
          font-size: 16px !important;
          text-decoration: none !important;
          display: block !important;
          transition: background-color 0.3s ease !important;
          margin: 10px;
        }
  
        .button:hover {
          background-color: #ff74ba !important; /* Pink */
        }
        a {
          display: inline-block !important;
          text-decoration: none;
          color: rgb(34, 176, 232) !important;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="container" style="margin-bottom: 40px">
          <h2 style="text-transform: uppercase">Confirmar Cuenta</h2>
          <p>Hola ${name}, Gracias por registrarte. Para confirmar tu cuenta, ingresa el siguiente código para confirmar tu cuenta</p>
  
          <div style="margin: 20px 0px">
            <p style="margin-bottom: 20px"><strong>CODIGO:</strong></p>
            <code>${confirmationCode}</code>
          </div>
  
          <div style="margin: 20px 0">
            <a
              class="boton"
              style="text-align: center; min-width: fit-content; margin-bottom: 10px"
              href="${process.env.FRONTEND_URL}/auth/confirmation/${token}"
              target="_blank"
            >
              Ingresa el código
            </a>
            <a class="boton" style="text-align: center; min-width: fit-content" href="${process.env.FRONTEND_URL}/auth/confirmation/${token}/${confirmationCode}"target="_blank">
              Confirmar directamente
            </a>
          </div>
  
          <p style="color: #ccc !important; font-size: 14px; text-align: center; line-height: 1.2">
            Si no has solicitado la confirmación de tu cuenta, puedes ignorar este correo.
          </p>
  
          <a href="${process.env.FRONTEND_URL}" target="_blank">${process.env.FRONTEND_URL}</a>
        </div>
  
        <div style="color: #fff !important; font-size: 12px">
          <div style="max-width: 600px; margin: auto; text-align: center">
            <hr style="border: 1px solid #fff !important" />
            <p style="font-style: italic; color: #fff !important; margin-bottom: 0">Copyright © 2024 Orden Facil, All rights reserved.</p>
            <p style="color: #fff !important">
              Puedes visitar mi sitio web para mas información
              <a style="color: #14a2e9 !important; font-weight: bold" href="https://martin-dev.netlify.app" rel="noopener" target="_blank"
                >Martin Flores</a
              >
            </p>
            <hr style="border: 1px solid #fff !important" />
          </div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
        </div>
      </div>
    </body>
  </html>
  `;
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: 'martinflorestorres21@gmail.com',
    subject: 'Compruebe su cuenta - Orden Facil',
    text: 'Orden Facil',
    html: HTML,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email Enviado');
      return true;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
};
