import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'A360 Intelligence',
  description: 'AI-powered analytics dashboard for aesthetic clinics',
  icons: {
    icon: 'https://ik.imagekit.io/0fheaxmfc/Facebook%20Profile%20Image.jpg?updatedAt=1756358866069',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/shepherd.js@13.0.3/dist/css/shepherd.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
