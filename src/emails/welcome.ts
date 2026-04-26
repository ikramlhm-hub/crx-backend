import { resend } from '../lib/resend'

export async function sendWelcomeEmail(email: string, brandName: string) {
  await resend.emails.send({
    from: 'CRX <onboarding@resend.dev>',
    to: email,
    subject: `Bienvenue sur CRX, ${brandName} ! 🎉`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #000;">Bienvenue sur CRX !</h1>
        <p>Bonjour <strong>${brandName}</strong>,</p>
        <p>Votre candidature a été approuvée. Vous faites maintenant partie de la communauté CRX.</p>
        <p>Vous disposez de <strong>1 000 crédits</strong> pour commencer à booster votre visibilité.</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Ce que vous pouvez faire maintenant :</h3>
          <ul>
            <li>Ajouter vos produits à votre boutique</li>
            <li>Personnaliser votre page marque</li>
            <li>Utiliser vos crédits pour être mis en avant</li>
          </ul>
        </div>
        <p>L'équipe CRX</p>
      </div>
    `
  })
}