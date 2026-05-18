import './globals.css';
import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: "Lien pour l'autre — L'habitat inclusif",
  description: "Faites reculer la précarité par l'entraide en créant des colocations partagées.",
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
      <body>
        {children}
      </body>
    </html>
  );
}
