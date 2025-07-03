# Lazy Loading

Next.js 15 zaten **built-in lazy loading** sunuyor ama **ihtiyacına göre farklı stratejiler kullanabilirsin**.

---

## **🚀 1️⃣ Next.js Built-in Lazy Loading (`next/dynamic`)**

**Ne için?**
✅ **Sayfa yavaş açılmasın diye ağır bileşenleri geç yüklemek**
✅ **SSR istemediğin bileşenleri istemci tarafında yüklemek**

📂 **Örnek Kullanım (`next/dynamic` ile)**

```tsx
import dynamic from "next/dynamic"

// Ağır bir bileşeni lazy load et
const HeavyComponent = dynamic(
	() => import("@/components/HeavyComponent"),
	{
		loading: () => <p>Loading...</p>,
		ssr: false, // Sadece istemci tarafında yüklensin
	}
)

export default function Page() {
	return (
		<div>
			<h1>Lazy Loading Örneği</h1>
			<HeavyComponent />
		</div>
	)
}
```

✅ **Avantaj:** Sayfa yavaş açılmaz, sadece ihtiyacın olan bileşen lazy load edilir.
🚨 **Dikkat:** `ssr: false` demek **bileşenin sunucuda render edilmeyeceği** anlamına gelir. Eğer SEO önemliyse dikkat et.

---

## **🚀 2️⃣ React Suspense + Next.js App Router (`React.lazy`)**

**Ne için?**
✅ **Sunucu bileşenlerini yüklerken loading state göstermek**
✅ **İç içe sayfalarda (layout içinde) geç yükleme yapmak**

📂 **Örnek Kullanım (`React.lazy` ile)**

```tsx
import { Suspense, lazy } from "react"

const Profile = lazy(
	() => import("@/features/profile/components/ProfileCard")
)

export default function Page() {
	return (
		<div>
			<h1>Profile Page</h1>
			<Suspense fallback={<p>Loading profile...</p>}>
				<Profile />
			</Suspense>
		</div>
	)
}
```

✅ **Avantaj:** **Lazy loading + daha iyi SSR desteği** (Next.js 15 ile tam uyumlu).

---

## **🚀 3️⃣ Next.js İçin Görsel Lazy Loading (`next/image`)**

**Ne için?**
✅ **Resimleri performanslı yüklemek**
✅ **Görselleri ekrana geldiğinde yüklemek**

📂 **Örnek Kullanım (`next/image` ile)**

```tsx
import Image from "next/image"

export default function Page() {
	return (
		<div>
			<h1>Lazy Loaded Image</h1>
			<Image
				src="/images/large-image.jpg"
				width={800}
				height={600}
				alt="Example"
				loading="lazy"
			/>
		</div>
	)
}
```

✅ **Avantaj:** Kullanıcının ekranına gelene kadar görsel yüklenmez.

---

## **📌 Sonuç**

- **Ağır bileşenler** için → **`next/dynamic`**
- **Layout veya içerik bazlı yükleme** için → **`React.lazy + Suspense`**
- **Resimler için** → **`next/image` (built-in lazy loading)**

🔥 **Hangi lazy loading yöntemi en iyisi?** **İhtiyacına göre değişir.** En sık kullanacağın **`next/dynamic` ve `next/image` olacak.**

Şimdi **kaydırak kaydır!** 🛝🔥🚀
