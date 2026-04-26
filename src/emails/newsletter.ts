import { resend } from '../lib/resend'
import { newsletterService } from '../modules/newsletter/newsletter.service'

interface BrandHighlight {
  name: string
  slug: string
  description: string
  logo?: string | null
}

export async function sendNewsletter(brands: BrandHighlight[]) {
  const subscribers = await newsletterService.getSubscribers()

  if (subscribers.length === 0) {
    console.log('Aucun abonné à la newsletter')
    return
  }

  const emails = subscribers.map(s => s.email)

  const brandsHtml = brands.map(brand => `
    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 16px 0;">
      ${brand.logo ? `<img src="${brand.logo}" alt="${brand.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 50%;" />` : ''}
      <h2 style="margin: 10px 0;">${brand.name}</h2>
      <p style="color: #555;">${brand.description}</p>
      <a href="https://crx.fr/brands/${brand.slug}"
         style="background: #000; color: #fff; padding: 10px 20px;
                text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px;">
        Découvrir
      </a>
    </div>
  `).join('')

  await resend.emails.send({
    from: 'CRX <onboarding@resend.dev>',
    to: emails,
    subject: `Les marques CRX du moment 🌟`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #000;">Les marques CRX du moment</h1>
        <p>Découvrez les créateurs indépendants sélectionnés par CRX cette semaine.</p>
        ${brandsHtml}
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Vous recevez cet email car vous êtes abonné à la newsletter CRX.
          <a href="https://crx.fr/newsletter/unsubscribe">Se désinscrire</a>
        </p>
      </div>
    `
  })
}