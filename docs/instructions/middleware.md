# Middleware

Next.js 15’te **middleware kullanımı genellikle aşağıdaki durumlar için gereklidir**:
✅ **Auth & Redirect Kontrolleri** → Kullanıcı giriş yapmadıysa `/login` sayfasına yönlendirme
✅ **Rate Limiting & Güvenlik** → API isteklerini sınırlandırma, bot koruma
✅ **Dil Yönlendirmeleri (i18n)** → Kullanıcının tarayıcı diline göre otomatik yönlendirme
✅ **Feature Flag & A/B Testing** → Kullanıcıya farklı versiyonlar sunma

---

## **🚀 Middleware Dosya Yapısı**

📂 **`src/middleware.ts` kullanarak tüm middleware yönetimini buradan yapmalısın.**

```plaintext
📂 src/
 ┣ 📄 middleware.ts  👈 **Next.js Middleware**
 ┣ 📂 lib/
 ┃ ┣ 📂 middlewares/  👈 **Modüler middleware’ler**
 ┃ ┃ ┣ 📄 auth.ts      👈 **Auth Middleware**
 ┃ ┃ ┣ 📄 rate-limit.ts 👈 **Rate Limit Middleware**
 ┃ ┃ ┗ 📄 i18n.ts      👈 **Dil Yönlendirme Middleware**
```

---

## **📌 1️⃣ Global Middleware (`middleware.ts`)**

📂 **`src/middleware.ts`** _(Tüm istekleri kontrol eden global middleware)_

```ts
import { authMiddleware } from "@/lib/middlewares/auth"
import { rateLimitMiddleware } from "@/lib/middlewares/rate-limit"
import { i18nMiddleware } from "@/lib/middlewares/i18n"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
	// Auth Middleware
	const authResponse = authMiddleware(request)
	if (authResponse) return authResponse

	// Rate Limiting Middleware
	const rateLimitResponse = rateLimitMiddleware(request)
	if (rateLimitResponse) return rateLimitResponse

	// i18n Middleware
	return i18nMiddleware(request)
}

// Middleware'in hangi sayfalarda çalışacağını belirle
export const config = {
	matcher: ["/dashboard/:path*", "/profile/:path*"], // Sadece belirli sayfalarda çalıştır
}
```

---

## **📌 2️⃣ Auth Middleware (Kullanıcı Girişi Zorunluysa)**

📂 **`src/lib/middlewares/auth.ts`**

```ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function authMiddleware(request: NextRequest) {
	const token = request.cookies.get("token")?.value
	if (!token) {
		return NextResponse.redirect(new URL("/login", request.url))
	}
	return null // Devam etmesine izin ver
}
```

✅ **Avantaj:**

- Kullanıcı giriş yapmamışsa **otomatik `/login` sayfasına yönlendirir**.
- **Tüm sayfalar için değil, sadece gerekli sayfalar için çalışır** (`matcher` kullanarak).

---

## **📌 3️⃣ Rate Limit Middleware (Spam Koruma)**

📂 **`src/lib/middlewares/rate-limit.ts`**

```ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const requests = new Map<string, number>()

export function rateLimitMiddleware(request: NextRequest) {
	const ip = request.ip ?? "anonymous"

	const now = Date.now()
	const lastRequest = requests.get(ip) || 0

	if (now - lastRequest < 1000) {
		return NextResponse.json(
			{ error: "Too many requests" },
			{ status: 429 }
		)
	}

	requests.set(ip, now)
	return null
}
```

✅ **Avantaj:**

- **DDoS veya spam saldırılarını önlemek için rate limiting sağlar.**
- **Özellikle API isteklerinde kullanışlıdır.**

---

## **📌 4️⃣ i18n Middleware (Dil Yönlendirmesi)**

📂 **`src/lib/middlewares/i18n.ts`**

```ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const locales = ["en", "tr"]

export function i18nMiddleware(request: NextRequest) {
	const url = new URL(request.url)
	const pathname = url.pathname

	// Eğer zaten bir dil prefiksi varsa (örn: `/tr/dashboard`), devam et
	if (locales.some(locale => pathname.startsWith(`/${locale}/`))) {
		return null
	}

	// Kullanıcının tarayıcı dilini al
	const userLang =
		request.headers.get("accept-language")?.split(",")[0].split("-")[0] ||
		"en"
	const locale = locales.includes(userLang) ? userLang : "en"

	// Yeni yönlendirme
	return NextResponse.redirect(
		new URL(`/${locale}${pathname}`, request.url)
	)
}
```

✅ **Avantaj:**

- Kullanıcının **tarayıcı diline göre otomatik yönlendirme** yapar.
- Örneğin **Türk kullanıcı `/dashboard` yazarsa, `/tr/dashboard`’a yönlendirilir.**

---

## **📌 Sonuç: Middleware Yapısı**

- **Global middleware:** `src/middleware.ts` → Burada tüm middleware'leri topluyoruz.
- **Modüler middleware'ler:** `src/lib/middlewares/` içinde, ihtiyaca göre çağırıyoruz.
- **Matcher kullanarak sadece belirli sayfalarda çalıştırıyoruz.**

🔥 **Büyük eksik yok.** Eğer bir middleware ihtiyacın doğarsa, `src/lib/middlewares/` içine ekleyip `middleware.ts` içinde çağırabilirsin.

Şimdi **middleware tamam!** **Kaydırak kaydır!** 🛝🔥🚀
