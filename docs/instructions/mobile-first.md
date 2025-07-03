# Mobile First

## Tam Ekran Deneyimi ve Minimal UI

- PWA’yı tam anlamıyla destekle.
- Mobil-first UI kullan, basit ve sezgisel tut.
- Tasarımın dikkat dağıtmadan, içeriğe odaklanması gerekiyor.
- Status Bar'ı (üst bildirim çubuğu) gizleyebilmelisin.
- Tam ekran deneyimi için PWA display: fullscreen veya standalone olmalı.
- ChatGPT ve Telegram gibi içerik odaklı bir arayüz oluştur.
- Menüleri gizleyip gerektiğinde açılacak hale getir (örn: auto-hide navbar).

## Touch-Friendly UI (Mobil Kullanıcılar için)

- Öncelikli bileşenleri yukarı koy, fazla içerikten kaçın.
- Kullanicinin en cok etkilesime girecegi alanlari asagida parmakla erisilebilmesi icin tasarla.
- Büyük butonlar, minimal menüler ve basit navigasyon kullan.
- Butonları en az 48px yüksekliğinde yap.
- Gereksiz hover efektleri yerine, dokunmatik odaklı UI kullan.
- Çekme (pull-to-refresh) ve kaydırma hareketleri desteklenmeli.
- Mobilde kaydırma (swipe), çift dokunma (double tap) gibi hareketleri destekle.
- Sayfalar arasında sağa/sola kaydırma ile geçiş yapabilmeli.

## Navigasyon Seçeneklerini Optimize Et

- Navigasyon bar ve hareketlerle etkileşim arttırılmalı.
- En çok kullanılan butonları ekranın altına koy. (Başparmak erişimi için)
- Drawer, swipe ve hareket kontrolleriyle navigasyonu hızlandır.
- Mobilde sidebar yerine "Floating Navigation" veya alt navigasyon kullan.
- "Geri" tuşunu ve swipe-back hareketini destekle.

## Performans Optimizasyonu

- Lazy Loading kullan (Görünen bileşenleri önce yükle).
- Critical rendering path’i optimize et.
- Görselleri WebP formatında kullan.
- Cache ve Service Worker ile tekrar yüklemeyi azalt.
- Mobilde hızlı yükleme için her görsel optimize edilmeli.
- Görselleri WebP veya AVIF formatında kullan.
- SVG ve ikonları olabildiğince az kullan.
- Lighthouse ile hız testleri yap ve gereksiz yükleri temizle.
- Ön yükleme (Preload) stratejilerini kullan.

## Klavye ile Etkileşimleri Optimize Et

- Mobilde klavye açıldığında UI kaymamalı.
- Giriş kutularında (input) keyboardAvoidingView gibi çözümler uygulanmalı.
- Kullanıcının klavye ile etkileşimi sırasında, ilgili alanı büyüt ve odakla.
- Form girişlerinde AutoComplete ve AutoFill destekle.
- Enter’a basınca bir sonraki input’a geçmeli.
