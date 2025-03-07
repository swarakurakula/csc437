// src/pages/renderPage.ts
import {
    PageParts,
    renderWithDefaults
  } from "@calpoly/mustang/server";
  
  const defaults = {
    stylesheets: [
      "/styles/reset.css",
      "/styles/tokens.css",
      "/styles/page.css"
    ],
    styles: [],
    scripts: [],
    googleFontURL:
      "https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap",
    imports: {
      "@calpoly/mustang": "https://unpkg.com/@calpoly/mustang"
    }
  };
  
  export default function renderPage(page: PageParts) {
    return renderWithDefaults(page, defaults);
  }