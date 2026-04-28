# CRX Backend

API REST du projet CRX Marketplace — plateforme dédiée aux marques de mode indépendantes françaises.

---

## Stack technique

| Technologie | Rôle |
|---|---|
| Node.js 20 | Environnement d'exécution |
| TypeScript | Langage — typage statique |
| Fastify | Framework web |
| Prisma ORM | Accès base de données |
| PostgreSQL | Base de données |
| Docker | Conteneurisation |
| Zod | Validation des données entrantes |
| bcryptjs | Hashage des mots de passe |
| jsonwebtoken | Authentification JWT |
| node-cron | Tâches planifiées |
| Resend | Emails transactionnels |

---

## Architecture

Le backend suit une architecture **monolithe modulaire** organisée en 3 couches par module :

```
src/
├── modules/
│   ├── auth/           → Inscription, connexion, tokens JWT
│   ├── brands/         → Back-office marque
│   ├── products/       → Catalogue produits
│   ├── orders/         → Commandes
│   ├── credits/        → Système de crédits CRX
│   ├── admin/          → Dashboard et validation admin
│   └── newsletter/     → Abonnements newsletter
├── middlewares/
│   ├── authenticate.ts → Vérifie le token JWT
│   └── authorize.ts    → Vérifie le rôle utilisateur
├── lib/
│   ├── prisma.ts       → Instance Prisma
│   └── resend.ts       → Instance Resend
├── jobs/
│   └── creditsCron.ts  → Attribution mensuelle automatique des crédits
├── emails/
│   ├── welcome.ts
│   ├── orderConfirmation.ts
│   └── newsletter.ts
└── app.ts              → Point d'entrée
```

Chaque module contient :
- `*.routes.ts` — définit les URLs et les protections d'accès
- `*.controller.ts` — reçoit la requête, appelle le service, renvoie la réponse
- `*.service.ts` — contient toute la logique métier

---

## Prérequis

- Node.js 20+
- Docker (optionnel pour le développement local)
- Une base de données PostgreSQL

---

## Installation

```bash
# Cloner le repo
git clone https://github.com/ikramlhm-hub/crx-backend.git
cd crx-backend

# Installer les dépendances
npm install

# Copier et configurer les variables d'environnement
cp .env.example .env
```

---

## Variables d'environnement

Créer un fichier `.env` à la racine :

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
JWT_SECRET=votre_secret_jwt
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d
RESEND_API_KEY=re_votre_cle
NODE_ENV=development
PORT=3001
```

---

## Lancer en développement

```bash
# Appliquer les migrations
npx prisma migrate dev

# Générer le client Prisma
npx prisma generate

# Lancer le serveur en watch mode
npm run dev
```

Le serveur démarre sur `http://localhost:3001`

---

## Lancer avec Docker

```bash
# Builder l'image
docker build -t crx-backend .

# Lancer le conteneur
docker run -p 3001:3001 --env-file .env crx-backend
```

---

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Démarrage en développement avec hot reload |
| `npm run build` | Compilation TypeScript |
| `npm start` | Démarrage en production |

---

## Dockerfile expliqué

```dockerfile
# Image Node.js 20 Debian slim — nécessaire pour OpenSSL (requis par Prisma)
FROM node:20-slim

# Installation d'OpenSSL — indispensable pour la connexion chiffrée à PostgreSQL
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copie des dépendances en premier pour profiter du cache Docker
COPY package*.json ./
COPY prisma ./prisma/

# Installation exacte des versions définies dans package-lock.json
RUN npm ci

# Copie du code source
COPY . .

# Compilation TypeScript → JavaScript dans /dist
RUN npm run build

# Génération du client Prisma typé
RUN npx prisma generate

EXPOSE 10000

# Au démarrage : migrations puis lancement du serveur
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/app.js"]
```

---

## Endpoints principaux

### Authentification
```
POST   /api/auth/register     Inscription
POST   /api/auth/login        Connexion
POST   /api/auth/logout       Déconnexion
POST   /api/auth/refresh      Renouvellement du token
```

### Marques
```
GET    /api/brands            Liste des marques actives
GET    /api/brands/me         Mon profil marque (BRAND)
POST   /api/brands            Créer une marque (BRAND)
PATCH  /api/brands/me         Modifier son profil (BRAND)
```

### Produits
```
GET    /api/products          Catalogue complet
GET    /api/products/:id      Détail d'un produit
POST   /api/products          Créer un produit (BRAND)
PATCH  /api/products/:id      Modifier un produit (BRAND)
DELETE /api/products/:id      Supprimer un produit (BRAND)
```

### Commandes
```
GET    /api/orders            Mes commandes
POST   /api/orders            Créer une commande (CONSUMER)
```

### Crédits
```
GET    /api/credits           Mon solde et historique (BRAND)
POST   /api/credits/services  Demander un service (BRAND)
```

### Admin
```
GET    /api/admin/stats                         Métriques globales
GET    /api/admin/brands                        Toutes les marques
PATCH  /api/admin/brands/:id/approve            Approuver une marque
PATCH  /api/admin/brands/:id/reject             Rejeter une marque
GET    /api/admin/services                      Demandes de services
PATCH  /api/admin/services/:id/approve          Approuver un service
PATCH  /api/admin/services/:id/reject           Rejeter un service
PATCH  /api/admin/services/:id/complete         Compléter un service
```

### Health check
```
GET    /health                Statut du serveur
```

---

## Système de crédits

Chaque marque dispose d'un portefeuille de crédits CRX :

- **1 000 crédits** offerts à l'inscription
- **+1 000 crédits** automatiquement le 1er de chaque mois (cron job)
- Utilisés pour acheter des services de visibilité

| Service | Coût |
|---|---|
| Homepage highlight | 200 crédits |
| Post réseaux sociaux | 300 crédits |
| Boutique physique partenaire | 500 crédits |
| Shooting photo produits | 400 crédits |
| Participation événement | 350 crédits |
| Inclusion newsletter | 250 crédits |

Si l'admin rejette une demande, les crédits sont automatiquement remboursés via une transaction Prisma atomique.

---

## Sécurité

- Mots de passe hashés avec **bcrypt** (facteur 12)
- Authentification par **JWT** — access token 1h, refresh token 7j
- Refresh token stocké en base et révocable à la déconnexion
- **CORS** configuré avec liste blanche de domaines
- Validation des données entrantes avec **Zod** sur toutes les routes
- Protection des routes par **rôle** (CONSUMER / BRAND / ADMIN) vérifiée côté serveur

---

## Production

| Service | URL |
|---|---|
| Backend | https://crx-backend.onrender.com |
| Health check | https://crx-backend.onrender.com/health |
| Frontend | https://crx-market.fr |

**Comptes de démonstration**

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | admin@crx.fr | admin123secure |
| Marque | ikram@crx.fr | motdepasse123 |
| Consommateur | rayan@crx.fr | motdepasse123 |

---

## Auteure

Ikram Lahmouri — M1 Développeur Full Stack — 20 Avril 2026
