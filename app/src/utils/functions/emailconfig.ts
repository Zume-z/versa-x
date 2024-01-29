import { Theme } from 'next-auth'
import { createTransport } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

export async function emailConfig(params: { identifier: string; url: string; provider: { server: string | SMTPTransport.Options; from: string | undefined }; theme: Theme }) {
  const { identifier, url, provider, theme } = params
  const { host } = new URL(url)
  const transport = createTransport(provider.server)
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Versa X sign in.`,
    text: text({ url, host }),
    html: html({ url, host, theme }),
  })
  const failed = result.rejected.concat(result.pending).filter(Boolean)
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`)
  }
}

export function html(params: { url: string; host: string; theme: Theme }) {
  const { url } = params // theme
  // const escapedHost = host.replace(/\./g, '&#8203;.')
  const color = {
    background: '#fff',
    text: '#000000',
    mainBackground: '#fff',
    buttonBackground: '#000000',
    buttonBorder: '#000000',
    buttonText: '#ffffff',
  }

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; ">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        <strong>Versa X</strong>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Sign in to Versa X
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 4px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 4px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
                in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: { url: string; host: string }) {
  return ` Sign in to ${host}\n${url}\n\n`
}
