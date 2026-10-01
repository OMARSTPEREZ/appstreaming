import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StreamResell B2B — Plataforma Mayorista de Streaming & Licencias",
  description: "Portal privado para revendedores mayoristas de cuentas de streaming, pines de perfiles y licencias digitales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-[#080c16] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
