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

## Store admin

Run the app on Node.js 22.13 or newer. Set a unique `ADMIN_PASSWORD` of at least 8 characters in `.env.local` for development or in the server environment for production. Restart the server and open `/admin` to sign in. The dashboard uses one shared administrator credential.

The catalog, website orders, inventory and courier fees are stored in SQLite at `.data/store.sqlite` by default. Set `MOMENTS_DB_PATH` to place the database on a persistent, writable volume. Use a Node.js deployment with access to that volume across restarts. Serve production over HTTPS so the secure session cookie can be used.

The database starts with the repository catalog and an empty order history. Catalog changes and demo orders from the previous dashboard were saved in individual browsers. Keep those browser records available if any legacy changes need to be re-entered.

Checkout reserves inventory and records pay-on-pickup or pay-on-delivery orders. Staff update fulfilment and record payments from the Orders tab. Cancelling an unpaid order returns its units to inventory. Staff contact customers using the WhatsApp link in each order.

Use Categories to add, rename, or delete empty collections. A category URL stays the same after renaming. Assign products to collections from Product CMS. To record a WhatsApp or in-store sale, use Orders → New order. Manual orders use the same pricing and stock checks as website checkout.
