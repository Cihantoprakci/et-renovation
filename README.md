# E.T. Rénovation

Site vitrine d’une entreprise de rénovation fictive installée à Annemasse, réalisé pour le module Booster Portfolio (B2 Développement Web, MyDigitalSchool Annecy).

Le site présente l’entreprise, ses quatre métiers et ses chantiers, et permet d’estimer le prix de ses travaux avant d’envoyer une demande de devis.

Site en ligne : https://et-renovation.vercel.app

## Fonctionnalités

- **Estimateur de prix** : type de travaux, surface et commune. Le prix et les frais de déplacement depuis Annemasse sont calculés aussitôt.
- **Recherche de commune** avec l’[API Géo](https://geo.api.gouv.fr) (liste au clavier et à la souris).
- **Formulaire de devis en 4 étapes** : travaux, chantier, photos, coordonnées. Les réponses de l’estimateur sont reprises dans la demande.
- **Envoi des photos** sur Cloudinary, puis envoi du formulaire avec Formspree.
- **Curseur avant/après** sur la page Réalisations.
- **Menu mobile** et carrousel des chantiers sur l’accueil.

## Technologies

- HTML, CSS et JavaScript, sans framework ni outil de build
- Modules JavaScript natifs (`type="module"`)
- Hébergement sur Vercel

## Organisation du code

```
├─ index.html, services.html, realisations.html, ...   une page = un fichier
├─ vercel.json                                         adresses sans .html
└─ assets/
   ├─ css/
   │  ├─ base/         variables, reset, typographie et polices
   │  ├─ layout/       conteneur, sections, header, footer
   │  ├─ components/   un fichier par composant (bouton, champ, carte...)
   │  └─ pages/        styles propres à une seule page
   ├─ js/
   │  ├─ modules/      un fichier par fonctionnalité
   │  ├─ pages/        point d’entrée de chaque page
   │  └─ data/         prices.json
   ├─ fonts/           Barlow et Inter, hébergées sur le site
   ├─ icons/           icônes SVG
   └─ images/          photos en WebP, en deux tailles
```

Chaque page ne charge que les fichiers CSS et JS dont elle a besoin.

Les classes CSS suivent la convention BEM (`.hero__title`, `.button--primary`).

## Lancer le site en local

Les modules JavaScript ont besoin d’un serveur local :

```bash
npx http-server -p 5500
```

Puis ouvrir `http://localhost:5500`.

## Configuration

**Formspree** : créer un formulaire sur [formspree.io](https://formspree.io), puis mettre son identifiant dans l’attribut `action` du formulaire de `devis.html`.

**Cloudinary** : créer un « upload preset » non signé, puis renseigner `data-cloud-name` et `data-upload-preset` sur le formulaire de `devis.html`. Sans ces deux valeurs, la demande part sans les photos.

**Prix** : tous les tarifs sont dans `assets/js/data/prices.json`.

- `works` : un type de travaux par ligne, avec un prix minimum et maximum au m²
- `travel.freeUpToKm` : distance offerte
- `travel.pricePerKm` : prix du kilomètre au-delà
- `travel.maxKm` : limite de la zone d’intervention

## Accessibilité et performance

- Navigation complète au clavier, lien d’évitement, focus visible
- Libellés sur tous les champs, messages d’erreur reliés aux champs
- Contrastes vérifiés sur la charte (bleu nuit `#0b2f4a`, vert `#84c424`)
- Le formulaire reste utilisable sans JavaScript
- Images en WebP avec `srcset` et chargement différé, polices préchargées

## Crédits

- Photos : [Unsplash](https://unsplash.com)
- Carte : © les contributeurs d’[OpenStreetMap](https://www.openstreetmap.org/copyright)
- Polices : Barlow et Inter (SIL Open Font License)
- Maquettes : Figma

Projet réalisé par Cihan Toprakci.
