# Hesap Silme Sistemi

Bu sistem, kullanıcıların hesaplarını güvenli bir şekilde silmelerini sağlar. Hesap silme işlemi, kullanıcının isteği üzerine 7 gün sonra gerçekleşir ve bu süre içinde kullanıcı isterse silme işlemini iptal edebilir.

## Sistem Bileşenleri

1. **Veritabanı Tabloları**:

   - `deletion_requests`: Kullanıcıların hesap silme isteklerini takip eder
   - `account_deletion_logs`: Gerçekleşen silme işlemlerini loglar

2. **API Endpoint'leri**:

   - `/api/user/delete-request`: Hesap silme isteği oluşturur
   - `/api/user/cancel-deletion`: Hesap silme isteğini iptal eder
   - `/api/user/deletion-status`: Kullanıcının aktif silme isteği durumunu getirir
   - `/api/cron/process-deletions`: Zamanı gelen silme isteklerini işler

3. **Kullanıcı Arayüzü Bileşenleri**:
   - `DeleteAccountButton`: Hesap silme isteği oluşturmak için buton
   - `AccountDeletionStatus`: Aktif silme isteği varsa durumunu gösterir

## Cron Job Kurulumu

Hesap silme işlemlerinin otomatik olarak gerçekleşmesi için bir cron job kurulması gerekir. Bu job, her gün belirli bir saatte çalışarak zamanı gelen silme isteklerini işler.

### Vercel Cron Jobs Kurulumu

1. `vercel.json` dosyasına aşağıdaki yapılandırmayı ekleyin:

```json
{
	"crons": [
		{
			"path": "/api/cron/process-deletions?apiKey=YOUR_CRON_SECRET",
			"schedule": "0 3 * * *"
		}
	]
}
```

2. `.env` dosyasına CRON_SECRET değişkenini ekleyin:

```
CRON_SECRET=your-secure-random-string
```

### Alternatif Olarak Harici Cron Servisi Kullanımı

Vercel Cron Jobs kullanmak istemiyorsanız, aşağıdaki servislerden birini kullanabilirsiniz:

- [Upstash](https://upstash.com/)
- [Cronhooks](https://cronhooks.io/)
- [Cron-job.org](https://cron-job.org/)

Bu servisleri kullanırken, `/api/cron/process-deletions?apiKey=YOUR_CRON_SECRET` URL'sine günlük olarak bir GET isteği yapacak şekilde ayarlayın.

## IP Limitleri

Sistem, aynı IP adresinden yapılan hesap silme işlemlerini sınırlar. Varsayılan olarak, bir IP adresi 30 günlük bir süre içinde en fazla 3 hesap silebilir. Bu limitleri değiştirmek için `src/services/account-deletion/index.ts` dosyasındaki şu değişkenleri güncelleyin:

```typescript
const MAX_DELETIONS_PER_IP = 3
const IP_DELETION_WINDOW_DAYS = 30
```

## Güvenlik Önlemleri

1. Hesap silme işlemi için kullanıcının "DELETE" yazarak onay vermesi gerekir
2. Silme işlemi hemen gerçekleşmez, 7 günlük bir bekleme süresi vardır
3. Kullanıcı bu süre içinde isterse silme işlemini iptal edebilir
4. IP bazlı limitler, sistemin kötüye kullanımını engeller
5. Tüm silme işlemleri loglanır ve takip edilebilir

## Ek Notlar

- Hesap silme işlemi, kullanıcının tüm verilerini (ElevenLabs sesleri dahil) kalıcı olarak siler
- Silme işlemi geri alınamaz, bu nedenle kullanıcıya yeterli uyarılar gösterilir
- Sistem, Supabase ve ElevenLabs entegrasyonlarını kullanır
