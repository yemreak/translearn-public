# Features

- `demo.tsx` Olusturalan komponentlerin her birinin edge caserlerinin test edildigi ve son kullanicinin yapabilecegi eylemeleri taklit ettigimiz sayfa
- `page.tsx` Son kullaniciya gosterilen sayfa
- `database/` Database ile ilgili islemler, supabase islemleri ve sql kodlari

  ```ts
  export async function getShortlinkBySlug(
  	slug: string
  ): Promise<Shortlink | null> {
  	const supabase = await createSupabaseServerClient()
  	const { data, error } = await supabase
  		.from("shortlinks")
  		.select("*")
  		.eq("slug", slug)
  		.eq("is_active", true)
  		.single()

  	if (error) {
  		console.error("Error fetching shortlink:", error)
  		return null
  	}

  	return data as Shortlink
  }
  ```

- Don't add `index.ts` file to the folder, not necessary

```py
┣ 📂 features/                     # Tüm Feature'lar burada
┃ ┣ 📂 auth/                       # Authentication (Login, Register, Session)
┃ ┃ ┣ 📂 components/               # UI bileşenleri
┃ ┃ ┣ 📂 hooks/                    # Zustand, TanStack Query Hookları
┃ ┃ ┣ 📂 actions/                  # Server Actions (Login, Logout, Register)
┃ ┃ ┣ 📂 database/                 # Database ile ilgili islemler, supabase islemleri ve sql kodlari
┃ ┃ ┣ 📂 schemas/                  # Auth doğrulama şemaları (Zod)
┃ ┃ ┣ 📂 stores/                   # Zustand store'ları
┃ ┃ ┣ 📂 lib/                      # Auth için özel yardımcı fonksiyonlar (supabase, notion, database, etc.)
┃ ┃ ┣ 📄 types.ts                  # Auth ile ilgili TS Tipleri (should single file)
┃ ┃ ┗ 📄 demo.tsx                  # Demo için kullanılan dosya
```
