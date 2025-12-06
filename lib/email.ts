import nodemailer from 'nodemailer';

// Configuración del transporter de nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Envía un email usando nodemailer
 * @param options Opciones del email (to, subject, html, text)
 * @returns Promise con el resultado del envío
 */
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'SIA - Sistema Inmobiliario'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log('Email enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error al enviar email:', error);
    return false;
  }
}

/**
 * Genera el HTML para el email de establecer contraseña
 * @param nombre Nombre del agente
 * @param token Token de verificación
 * @returns HTML del email
 */
export function generateSetPasswordEmailHTML(nombre: string, token: string): string {
  const setPasswordUrl = `${process.env.NEXTAUTH_URL}/establecer-contrasena?token=${token}`;

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Establecer Contraseña - SIA</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #6FC6D1; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">Bienvenido a SIA</h1>
      </div>

      <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #ddd;">
        <h2 style="color: #083C2C;">Hola ${nombre},</h2>

        <p>Se ha creado una cuenta de agente para ti en el Sistema Inmobiliario SIA.</p>

        <p>Para completar la configuración de tu cuenta, necesitas establecer tu contraseña. Por favor, haz clic en el siguiente botón:</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${setPasswordUrl}" style="background-color: #6FC6D1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Establecer Mi Contraseña</a>
        </div>

        <p>O copia y pega este enlace en tu navegador:</p>
        <p style="background-color: #fff; padding: 10px; border-radius: 4px; word-break: break-all; border: 1px solid #ddd;">
          ${setPasswordUrl}
        </p>

        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px;">
          <strong>Nota:</strong> Este enlace expirará en 24 horas por razones de seguridad.<br>
          Si no solicitaste esta cuenta, por favor ignora este email.
        </p>
      </div>

      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>&copy; 2024 SIA - Sistema Inmobiliario. Todos los derechos reservados.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Envía el email de establecer contraseña a un nuevo agente
 * @param email Email del agente
 * @param nombre Nombre del agente
 * @param token Token de verificación
 * @returns Promise<boolean> indicando si se envió correctamente
 */
export async function sendSetPasswordEmail(email: string, nombre: string, token: string): Promise<boolean> {
  const html = generateSetPasswordEmailHTML(nombre, token);
  const text = `Hola ${nombre},\n\nSe ha creado una cuenta de agente para ti en SIA.\n\nPara establecer tu contraseña, visita: ${process.env.NEXTAUTH_URL}/establecer-contrasena?token=${token}\n\nEste enlace expirará en 24 horas.\n\nSaludos,\nEquipo SIA`;

  return await sendEmail({
    to: email,
    subject: 'Establece tu contraseña - Sistema SIA',
    html,
    text,
  });
}
