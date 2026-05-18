import './globals.css';
import { Metadata, Viewport } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: "Lien pour l'autre — L'habitat inclusif",
  description: "Faites reculer la précarité par l'entraide en créant des colocations partagées.",
  // Next.js ajoutera automatiquement ton basePath '/manikadigar' devant ce chemin
  manifest: '/manifest.json', 
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "Lien pour l'autre",
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        {/* Préconnexion et chargement des polices Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,600&family=Outfit:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        {children}

        {/* Script d'initialisation du Service Worker (PWA) */}
        <Script id="pwa-sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                // L'utilisation de ./ permet au navigateur de résoudre 
                // le chemin correctement avec ton sous-dossier /manikadigar/
                navigator.serviceWorker.register('./sw.js')
                  .then(registration => {
                    console.log('Service Worker enregistré avec succès !', registration.scope);
                  })
                  .catch(error => {
                    console.log('Échec de l\\'enregistrement du Service Worker :', error);
                  });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
