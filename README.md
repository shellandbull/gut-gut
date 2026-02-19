# gut-gut

Welcome reader,

This is a small exploration into `next.js` and the use of AI client side.

I built an app that can gain access to a directory in your file system and programmatically parse PDFs inside of it for the purposes of extracting structured data from them. It specifically looks for real state data

```mermaid
flowchart TD
    A[Web App Launches] --> B[Download LLM from HuggingFace]
    B --> C{Model cached?}
    C -->|No| D[Download & cache in IndexedDB]
    C -->|Yes| E[Load from cache]
    D --> F[Model ready]
    E --> F

    F --> G[User selects directory via showDirectoryPicker]
    G --> H[Iterate through PDF files in directory]

    H --> I[PDF.js extracts text per page]
    I --> J[Build array of objects\n filename, page, content]

    J --> K[Send each entry to local LLM]
    K --> L[LLM extracts structured JSON\nfrom unstructured text]
    L --> M{More files/pages?}
    M -->|Yes| K
    M -->|No| N[Merge all extracted data]

    N --> O[Save structured data\npartial or complete]
    O --> P[Display GUI for user review]
    P --> Q[User fills in missing fields]
    Q --> R[Save final complete dataset]
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
