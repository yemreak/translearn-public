# Types

## Tek Kullanımlık type Tanımlamaktan Kurtul (Inline Props)

- Eğer type export edilmeyecekse
- Sadece tek bir component'te kullanılacaksa, direkt inline olarak yaz.
- 📂 En Temiz Çözüm (Inline Props)

```tsx
export function ProfileCard(props: {
	name: string
	email: string
	age?: number
}) {
	return (
		<div>
			<h2>{props.name}</h2>
			<p>{props.email}</p>
			<p>Age: {props.age ?? "Not provided"}</p>
		</div>
	)
}
```

## Eğer birden fazla component'te kullanılacaksa

- Çok fazla prop varsa, component imzası uzar ve karmaşık görünür.
- Destructuring sırasında kod okunabilirliği düşer.
- Daha temiz ve ölçeklenebilir bir yöntem; props tipini ayrı bir type olarak tanimla

```tsx
type ProfileCardProps = {
	name: string
	email: string
	age: number
}

export function ProfileCard(props: ProfileCardProps) {
	return (
		<div>
			<h2>{props.name}</h2>
			<p>{props.email}</p>
			<p>Age: {props.age}</p>
		</div>
	)
}
```

## API Dönen type'ları Otomatik Olarak Kullan (Return Type Inference)

- Eğer API’den veya DB’den veri çekiyorsan, manuel type tanımlamak yerine TypeScript'in otomatik çıkarmasını kullan.
- 📂 Gereksiz type Kullanımını Önle (ReturnType)

```tsx
export async function getProfile(userId: string) {
	return { name: "John Doe", email: "john@example.com", age: 25 }
}

// `ReturnType<typeof getProfile>` ile otomatik çıkar
type Profile = Awaited<ReturnType<typeof getProfile>>

export function ProfileCard(props: Profile) {
	return (
		<div>
			<h2>{props.name}</h2>
			<p>{props.email}</p>
			<p>Age: {props.age}</p>
		</div>
	)
}
```

- ✅ Elle type tanımlamaya gerek yok.
- ✅ `getProfile` fonksiyonunun döndüğü veriye göre type otomatik çıkarılıyor.
- ✅ Kodda tekrar eden type tanımlamalarını ortadan kaldırıyor.

## 📌 Sonuç: Tekrarlayan type’lardan Kurtul

Yöntem Nasıl Kullanmalısın?

- ✅ Inline Props (props.something) Eğer type export edilmiyorsa, direkt inline olarak yaz.
- ✅ API’den Dönen type'ları Kullanmaya Bırak ReturnType<typeof getProfile> kullanarak otomatik çıkar.
- ✅ Zod ile type Tanımlamayı Bırak z.infer<typeof profileSchema> ile elle yazma derdini unut.
- ✅ DB ve API type'larını TypeScript'e Bırak TypeScript zaten dönen veriyi tahmin edebiliyorsa, ekstra type yazma
- Elle type yazma derdini bırak.
- Zod, TypeScript inference ve ReturnType ile kodu temiz tut.
- Eğer type bir yerde tekrar kullanılmayacaksa, type bile yazma.
