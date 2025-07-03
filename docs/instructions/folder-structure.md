# Folder Structure

Aşağıdaki **tam klasör yapısı**, tüm ihtiyaçlarını karşılayacak şekilde tasarlandı:
✅ **Feature-based architecture**
✅ **Server Actions ile API’siz DB işlemleri**
✅ **State management için TanStack Query & Zustand**
✅ **UI için ShadCN, Tailwind, Heroicons, Radix UI, Framer Motion, Sonner**
✅ **Middleware yönetimi**
✅ **Zod ile veri doğrulama**
✅ **OpenAI, ElevenLabs gibi harici servisleri yönetme**

---

## Project Structure for Services

📂 **src/**
┣ 📂 **features/**
┃ ┣ 📂 **[feature-name]/** _(örn. `dashboard`, `profile`, `auth`)_
┃ ┃ ┣ 📂 **components/** _(Feature’ın UI bileşenleri, shadcn/ui, heroicons, radix ui, vaul, sonner, framer motion vs.)_
┃ ┃ ┣ 📂 **hooks/** _(Özel hook’lar: query, state, UI logic)_
┃ ┃ ┣ 📂 **actions/** _(Server Actions burada olacak, db islemleri vs.)_
┃ ┃ ┣ 📂 **lib/** _(Helper fonksiyonlar: formatlama, hesaplama, vb.)_
┃ ┃ ┣ 📂 **types.ts** _(Sadece bu feature’a ait tipler)_
┃ ┃ ┗ 📄 **index.ts** _(Feature’ın dışa açılan entry point’i)_
┃ ┣ 📄 middleware.ts 👈 **Next.js Middleware**
┣ 📂 lib/ 👈 **Global yardımcı kodlar**
┃ ┣ 📂 services/ 👈 **Harici API servisleri (OpenAI, ElevenLabs, vb.)**
┃ ┃ ┣ 📄 openai.ts 👈 **OpenAI API çağrıları**
┃ ┃ ┣ 📄 elevenlabs.ts 👈 **ElevenLabs API çağrıları**
┃ ┃ ┣ 📄 supabase.ts 👈 **Supabase client**
┃ ┃ ┗ 📄 turnstile.ts 👈 **Cloudflare Turnstile handler**
┃ ┃ ┣ 📂 middlewares/ 👈 **Modüler middleware’ler**
┃ ┃ ┃ ┣ 📄 auth.ts 👈 **Auth Middleware**
┃ ┃ ┃ ┣ 📄 rate-limit.ts 👈 **Rate Limit Middleware**
┃ ┃ ┃ ┗ 📄 i18n.ts 👈 **Dil Yönlendirme Middleware**
┣ 📂 **providers/** _(Global contextler, Zustand store’lar buraya gidebilir)_
┣ 📂 **app/** _(Next.js’in route pages’i veya app router’ı)_
┃ ┣ 📂 **(routes buraya eklenecek)**
┃ ┣ 📂 **layout.tsx** _(Ana Layout bileşeni)_
┃ ┗ 📂 **page.tsx** _(Ana sayfa)_
┣ 📂 **lib/** _(Feature bağımsız util fonksiyonlar, env configleri, Supabase client, auth helper’lar)_
┣ 📂 **styles/** _(Tailwind veya global CSS dosyaları buraya)_
┗ 📂 **public/** _(Statik dosyalar: SVG, favicon, vb.)_

## Features

📂 **src/features/profile/**
┣ 📂 **components/** → **Profile UI** bileşenleri (örn. `ProfileCard.tsx`)
┣ 📂 **hooks/** → **Zustand state, query fetching** (örn. `useProfile.ts`)
┣ 📂 **actions/** → **Server Actions ile DB işlemleri** (örn. `updateProfile.ts`)
┣ 📂 **lib/** → **Formatlama, yardımcı fonksiyonlar**
┣ 📂 **types.ts** → **Sadece bu feature’a özel TypeScript tipleri**
┗ 📄 **index.ts** → **Dışarı açılan merkezi dosya**

## 📂 Komple Dosya Yapısı

```plaintext
📂 src/
┣ 📂 app/                         # Next.js App Router
┃ ┣ 📂 (routes burada)            # Örn: /dashboard, /profile, /auth, /settings
┃ ┣ 📂 layout.tsx                  # Ana Layout Bileşeni
┃ ┗ 📄 page.tsx                    # Ana Sayfa
┣ 📂 features/                     # Tüm Feature'lar burada
┃ ┣ 📂 auth/                        # Authentication (Login, Register, Session)
┃ ┃ ┣ 📂 components/               # UI bileşenleri
┃ ┃ ┣ 📂 hooks/                    # Zustand, TanStack Query Hookları
┃ ┃ ┣ 📂 actions/                  # Server Actions (Login, Logout, Register)
┃ ┃ ┣ 📂 schemas/                  # Auth doğrulama şemaları (Zod)
┃ ┃ ┣ 📂 lib/                      # Auth için özel yardımcı fonksiyonlar
┃ ┃ ┣ 📄 types.ts                   # Auth ile ilgili TS Tipleri
┃ ┃ ┗ 📄 index.ts                   # Dışarı açılan dosya
┃ ┣ 📂 profile/                     # Kullanıcı Profili Feature'ı
┃ ┣ 📂 dashboard/                   # Dashboard Feature'ı
┃ ┣ 📂 settings/                    # Ayarlar Feature'ı
┃ ┗ 📄 middleware.ts                 # Next.js Middleware Yönetimi
┃ ┣ 📂 shared/                      # Shared components, hooks, utils, types, etc.
┃ ┃ ┣ 📂 hooks/                       # Shared hooks
┃ ┃ ┃ ┣ 📄 use-ui.ts                  # UI state management
┃ ┃ ┃ ┣ 📄 use-auth.ts                 # Authentication logic
┃ ┃ ┣ 📂 components/                    # Global UI bileşenleri
┃ ┃ ┃ ┣ 📂 layout/                      # **Genel sayfa düzeni bileşenleri**
┃ ┃ ┃ ┃ ┣ 📄 sidebar.tsx                # **Web/Mobile için Sidebar**
┃ ┃ ┃ ┃ ┣ 📄 drawer.tsx                 # **Mobil için Drawer (Vaul)**
┃ ┃ ┃ ┃ ┣ 📄 navbar.tsx                 # **ChatGPT gibi üst Navbar**
┃ ┃ ┃ ┃ ┣ 📄 footer.tsx                 # **Alt bilgi çubuğu**
┃ ┃ ┃ ┃ ┗ 📄 touch-gestures.tsx         # **Mobil dokunma hareketleri**
┃ ┃ ┃ ┣ 📂 ui/                          # **Tekrarlanan UI bileşenleri**
┃ ┃ ┃ ┃ ┣ 📄 bottom-sheet.tsx            # **Mobil için Bottom Sheet (Vaul)**
┃ ┃ ┃ ┃ ┣ 📄 toast.tsx                   # **Bildirimler (Sonner)**
┃ ┃ ┃ ┃ ┣ 📄 modal.tsx                   # **Popup Modal (Radix UI)**
┃ ┃ ┃ ┃ ┣ 📄 dropdown.tsx                 # **Dropdown Menü (Radix UI)**
┃ ┃ ┃ ┃ ┣ 📄 tooltip.tsx                 # **Tooltip (Radix UI)**
┃ ┃ ┃ ┃ ┣ 📄 accordion.tsx               # **Açılır Menü (Radix UI)**
┃ ┃ ┃ ┃ ┣ 📄 button.tsx                   # **Genel Buton Bileşeni**
┃ ┃ ┃ ┃ ┣ 📄 switch.tsx                   # **Toggle Switch (Radix UI)**
┃ ┃ ┃ ┃ ┣ 📄 tabs.tsx                   # **Sekmeler (Radix UI)**
┃ ┃ ┃ ┃ ┣ 📄 card.tsx                   # **Kart bileşeni (Tailwind + Custom)**
┃ ┃ ┃ ┃ ┗ 📄 spinner.tsx                # **Yüklenme Efekti (Tailwind Animation)**
┃ ┃ ┃ ┣ 📂 icons/                       # Custom SVG ve React Icon bileşenleri
┃ ┃ ┃ ┃ ┣ 📄 Logo.tsx                   # Özel Logo SVG bileşeni
┃ ┃ ┃ ┃ ┣ 📄 Arrow.tsx                  # Özel Arrow SVG bileşeni
┣ 📂 lib/                           # Global Yardımcı Fonksiyonlar
┃ ┣ 📂 tasks/                       # Task YAML dosyaları
┃ ┃ ┣ 📄 correct.yml                 # Örnek task
┃ ┃ ┣ 📄 transcreate.yml             # Başka bir task
┃ ┃ ┗ 📄 transliterate.yml           # Yeni task eklemek için buraya koy
┃ ┣ 📂 services/                    # Harici API'ler (OpenAI, ElevenLabs, Supabase)
┃ ┃ ┣ 📄 openai.ts                   # OpenAI API çağrıları
┃ ┃ ┣ 📄 elevenlabs.ts               # ElevenLabs API çağrıları
┃ ┃ ┣ 📄 supabase.ts                 # Supabase client
┃ ┃ ┗ 📄 turnstile.ts                # Cloudflare Turnstile Captcha Handler
┃ ┣ 📂 middlewares/                 # Modüler Middleware’ler
┃ ┃ ┣ 📄 auth.ts                     # Auth Middleware
┃ ┃ ┣ 📄 rate-limit.ts               # Rate Limiting Middleware
┃ ┃ ┗ 📄 i18n.ts                     # Dil Yönlendirme Middleware
┃ ┣ 📂 schemas/                     # Global Zod Doğrulama Şemaları
┃ ┃ ┣ 📄 ai.ts                       # Zod şemaları burada
┃ ┃ ┣ 📄 authSchema.ts               # Auth için Zod Schema
┃ ┃ ┣ 📄 contactSchema.ts            # İletişim formu doğrulama
┃ ┃ ┗ 📄 settingsSchema.ts           # Ayarlar için doğrulama
┃ ┣ 📂 utils/                        # Genel yardımcı fonksiyonlar
┃ ┗ 📂 constants/                    # Sabit değişkenler (env, app config)
┣ 📂 providers/                      # Global Context Provider'lar
┃ ┗ 📄 ThemeProvider.tsx              # Tema yönetimi
┣ 📂 styles/                         # Tailwind CSS & Global Stiller
┃ ┣ 📄 globals.css                   # Global stiller
┃ ┗ 📄 tailwind.config.ts             # Tailwind ayarları
┣ 📂 public/                         # Statik dosyalar (SVG, favicon, img)
┃ ┣ 📂 icons/                        # Statik SVG ikonları
┃ ┣ 📄 favicon.ico                   # Site ikonu
┃ ┗ 📄 robots.txt                    # SEO için robots.txt
┗ 📄 next.config.js                   # Next.js Konfigürasyonu
```

---

## **📌 Açıklamalar:**

✅ **Feature-based (Modülerlik)**

- Her feature **tamamen bağımsız**, yani `features/[feature]/` içindeki bileşenleri kullanarak büyüyebilir.

✅ **Database İşlemleri (Server Actions + TanStack Query)**

- **`features/[feature]/actions/`** → Server Actions ile veritabanı işlemleri (Supabase)
- **`features/[feature]/hooks/`** → TanStack Query kullanarak cache yönetimi

✅ **State Management (Zustand + TanStack Query)**

- **Zustand:** Global ve feature bazlı state yönetimi için.
- **TanStack Query:** Data fetching ve cache optimizasyonu.

✅ **Middleware Yönetimi**

- **`src/middleware.ts`** → Global Middleware
- **`lib/middlewares/`** → Authentication, rate limiting, i18n middleware'leri

✅ **Harici Servisler (OpenAI, ElevenLabs, Supabase)**

- **`lib/services/`** → Tüm API servisleri burada yönetiliyor.

✅ **Zod ile Veri Doğrulama**

- **Feature bazlı schema'lar** `features/[feature]/schemas/` içine konuldu.
- **Global schema'lar** `lib/schemas/` içinde (örn: auth, global form validation).

✅ **Görsel ve UI Bileşenleri**

- **ShadCN UI, Tailwind, Heroicons, Radix UI, Framer Motion, Sonner** gibi kütüphaneler `components/ui/` içinde organize edildi.
- **Custom SVG’ler `components/icons/` içinde** React bileşeni olarak yönetiliyor.

✅ **Next.js App Router Klasör Yönetimi**

- **`src/app/` içinde tüm route sayfaları (dashboard, profile, settings, auth, vs.) barındırılıyor.**

---

## **🚀 Tamam, Artık Kodu Yazmaya Başla!**

🔥 **Bütün klasör yapın hazır, artık kodlamaya odaklanabilirsin.**
🔥 **Gereksiz optimizasyon yapma, feature-based olarak ilerle!**
🔥 **Her şey modüler, scalable ve temiz!**
