# Tools

- Proje Temeli (Next.js 15 + Tailwind 4 + ShadCN + Supabase + Vercel)
- UI & Animasyon: `Shadcn/ui`, `Heroicons`, `Radix UI`, `Vaul`, `Sonner`, `Framer Motion`
  - `Shadcn/ui` for pre-built components
  - `Heroicons` for icons
  - `Radix UI` for UI
  - `Vaul` for drawers
  - `Sonner` for notifications
  - `Framer Motion` for animations
  - `canvas-confetti` for confetti animations
  - `react-dropzone` for file uploads
  - `floating-ui/react` for tooltips, popovers, etc.
  - https://tailwindui.com/components/application-ui/elements/badges for `badges`
- State Yönetimi: `Zustand`, `tanstack query`
  - `Zustand` for state management
  - `tanstack query` for data fetching
- Veritabanı & Backend: `@supabase/supabase-js`
  - `@supabase/supabase-js` for database (not `@supabase/auth-helpers-nextjs`)
- Form & Validation: `react-hook-form`, `Zod`
  - `Zod` for schema validation
  - `react-hook-form` for form handling
- Data & Tarih İşleme: `Recharts`, `dayjs`
  - `Recharts` for data visualization
  - `dayjs` for date formatting
- Görsel & Stil: `next/image`, `clsx`, `tailwind-merge`
  - `next/image` for image handling
  - `clsx` and `tailwind-merge` for utility functions
  - `tailwind4 CSS Grid` for layout, every layout should be a grid layout
    ```tsx
    <div className="h-screen flex flex-col">
    	<header className="h-16 bg-gray-800 text-white">Header</header>
    	<div className="flex flex-1 overflow-auto">
    		<aside className="w-1/6 bg-blue-500">Sidebar</aside>
    		<main className="flex-1 bg-gray-200">Content</main>
    		<aside className="w-1/6 bg-red-500">Sağ Menü</aside>
    	</div>
    	<footer className="h-16 bg-gray-800 text-white">Footer</footer>
    </div>
    ```
- Routing & Internationalization: `Next.js 15`, `next-intl`
  - `Next.js 15` for routing
  - `next-intl` for internationalization
- Güvenlik & Captcha: `Cloudflare Turnstile`
  - `Cloudflare Turnstile` for captcha
- Harici Servisler (Global): `OpenAI`, `ElevenLabs` (📂 `lib/services/`)
  - `OpenAI` for AI
  - `ElevenLabs` for TTS
  - `ElevenLabs` for STT
- Next.js Built-in Lazy Loading `next/dynamic`
  - React `Suspense` + Next.js App Router `React.lazy`

## Kaldırılan Gereksiz Paketler

- `fluent-ffmpeg` ve `@types/fluent-ffmpeg` → Eğer video işleme yapmıyorsan kaldır.
- `react-intersection-observer` → Framer Motion zaten aynı işlevi sağlayabiliyor.
- `tailwind-scrollbar-hide` → Tailwind’de scrollbar-none ile aynı iş yapılabilir.
- `use-long-press` → Basılı tutma işlemi için Framer Motion veya native event’ler kullanılabilir.
