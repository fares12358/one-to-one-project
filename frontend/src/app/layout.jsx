import "./globals.css";
import { LangProvider } from "@/context/LangContext";
import BrandTheme from "@/components/BrandTheme";
import MetaPixel from "@/components/MetaPixel";

export const metadata = {
  title: "One to One | Field-Trial Intelligence for Egypt's Seed Market",
  description:
    "One to One is Egypt's first independent field-trial management platform for vegetable seed companies — turning agricultural trials into confident, data-driven launch decisions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <BrandTheme />
        <MetaPixel />
        <LangProvider>
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
