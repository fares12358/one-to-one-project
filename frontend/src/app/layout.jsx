import "./globals.css";
import { LangProvider } from "@/context/LangContext";
import BrandTheme from "@/components/BrandTheme";
import MetaPixel from "@/components/MetaPixel";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata = {
  metadataBase: new URL("https://oneto-one.com"),

  title: {
    default: "One to One | Field-Trial Intelligence for Egypt's Seed Market",
    template: "%s | One to One",
  },

  description:
    "One to One is Egypt's first independent field-trial management platform for vegetable seed companies — turning agricultural trials into confident, data-driven launch decisions.",

  applicationName: "One to One",

  keywords: [
    "field trials Egypt",
    "seed trials Egypt",
    "vegetable seeds Egypt",
    "field trial management",
    "seed variety evaluation",
    "agricultural trials",
    "vegetable seed companies",
    "agricultural research Egypt",
  ],

  authors: [
    {
      name: "One to One",
      url: "https://oneto-one.com",
    },
  ],

  creator: "One to One",
  publisher: "One to One",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_EG",
    url: "https://oneto-one.com",
    siteName: "One to One",

    title: "One to One | Field-Trial Intelligence for Egypt's Seed Market",

    description:
      "Independent field-trial management and variety evaluation for vegetable seed companies in Egypt.",
  },

  twitter: {
    card: "summary_large_image",

    title: "One to One | Field-Trial Intelligence for Egypt's Seed Market",

    description:
      "Independent field-trial management and variety evaluation for vegetable seed companies in Egypt.",
  },

  appleWebApp: {
    title: "One to One",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <BrandTheme />
        <MetaPixel />
        <GoogleAnalytics />

        <LangProvider>
          {children}
        </LangProvider>
      </body>
    </html>
  );
}