# gut-gut

Welcome reader,

This is a small exploration into `next.js` and the use of AI client side.

I built an app that can gain access to a directory in your file system and programmatically parse PDFs inside of it for the purposes of extracting structured data from them. It specifically looks for real state data

<p align="center">
  <img width="377" height="1107" alt="image" src="https://github.com/user-attachments/assets/5378a50e-da9e-4a33-bc2d-318fe7361df2" />
</p>

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Bugs 🐛

The app is currently not working because I haven't found an LLM that can:

- Run client-side
- Parse text into structured output within a reasonable timeframe
- Be fast to download, or be rapidly available

If I were to get past this, I would be able to gain access to one of the directories in your file system, extract text page by page and document by document, then systematically save a batch of partial records that an admin can later fill out manually if needed. The base prompt for text extraction is specialised for a German Teilungserklärung, but this can be turned into a parameter too

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
