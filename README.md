# 🪙 MunaPay

![Architecture Diagram](https://cdn.dorahacks.io/static/files/1990d31322bd16a33e2a1ff4f2880a5a.png)

> For **full documentation** on how MunaPay works and how to integrate it into your project, please visit:  
> [📚 MunaPay Docs](https://zenvid.gitbook.io/muna-pay)

---

## 🚀 Overview

This is the **Next.js 15+ frontend** for [MunaPay](https://munapay.xyz) — the next-gen checkout solution making BTC acceptance and integration simple and secure.  
It powers the **dashboard, hosted checkout pages, and onboarding flows**.

---

## 📂 Project Structure

```bash
munapay-frontend/
├── app/                 # Next.js App Router (pages, layouts, routes)
│   ├── dashboard/       # Merchant dashboard (payments, stats, settings)
│   ├── checkout/        # Hosted checkout pages
│   ├── onboarding/      # Onboarding flow (account + business setup)
│   ├── api/             # API routes (SSR helpers, not backend)
│   └── ...              # Other Next.js routes
├── components/          # Reusable UI components (shadcn/ui + custom)
├── hooks/               # React hooks (auth, form, utils)
├── lib/                 # Helpers (api client, validation, constants)
├── public/              # Static assets (logos, images, fonts)
├── styles/              # Global TailwindCSS styles
├── types/               # TypeScript types
├── .env.example         # Example env vars
├── package.json
└── tsconfig.json



🛠️ Installation


```bash
git clone https://github.com/YOUR_ORG/munapay-frontend.git
cd munapay-frontend
pnpm install   # or npm/yarn

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



## Contributing

Contributions are welcome!
Please fork the repo and open a PR


---

👉 Quick summary of what we did:  
- Put the **architecture image at the top**.  
- Added a **docs link note** under it.  
- Clear **project structure**.  
- Minimal **install & run guide**.  
- Highlights + tech stack.  

