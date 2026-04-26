import { resend } from '../lib/resend'

export async function sendOrderConfirmationEmail(
  email: string,
  orderId: string,
  total: number,
  items: { name: string; quantity: number; price: number }[]
) {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.price}€</td>
    </tr>
  `).join('')

  await resend.emails.send({
    from: 'CRX <onboarding@resend.dev>',
    to: email,
    subject: `Confirmation de votre commande CRX #${orderId.slice(-6)}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #000;">Commande confirmée ✅</h1>
        <p>Merci pour votre commande ! Voici le récapitulatif :</p>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 10px; text-align: left;">Produit</th>
              <th style="padding: 10px; text-align: left;">Quantité</th>
              <th style="padding: 10px; text-align: left;">Prix</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <div style="margin-top: 20px; text-align: right;">
          <strong>Total : ${total}€</strong>
        </div>
        <p style="margin-top: 30px;">Votre commande est en cours de traitement. Vous serez notifié dès l'expédition.</p>
        <p>L'équipe CRX</p>
      </div>
    `
  })
}