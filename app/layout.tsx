import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PwaBanner from "./components/PwaBanner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#1F3864",
};

export const metadata: Metadata = {
  title: "FaccioCtrl | Controle de Ordens de Produção",
  description: "Pare de controlar suas facções pelo WhatsApp. Cadastre facções, crie ordens de produção e acompanhe prazos em tempo real.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('beforeinstallprompt', function(e) {
                e.preventDefault();
                window.deferredPwaPrompt = e;
                console.log('[PWA] beforeinstallprompt capturado!');
              });

              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js').then(function(reg) {
                  console.log('[PWA] Service Worker registrado:', reg.scope);
                }).catch(function(err) {
                  console.error('[PWA] Erro ao registrar SW:', err);
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <PwaBanner />
      </body>
    </html>
  );
}
