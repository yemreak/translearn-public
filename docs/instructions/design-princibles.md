# Design Principles

- Tasarimlarda Telegram ve ChatGPT'i ilham almalisin ozellikle Telegram Muazzam bir tasarim.
- AI odakli bir uygulama yapiyorum, içeriklerinize dikkat cekmelisin

## 🔵 İnsan Beyni ve Kullanıcı Deneyimi

- Beyin alışkanlıklara göre çalışır → "Alışılmış" arayüzleri tercih et.
- Beyin en az enerjiyle en hızlı çözümü ister → "Kolay, anlaşılır ve minimal tasarım" en iyi çözümdür.
- Alışkanlıkları değiştirirsen, beyin ekstra çaba harcamak zorunda kalır → Bu yüzden radikal UI değişikliklerinden kaçın.
- Basit ve anlaşılır arayüz: Siyah arka plan, düz yazılar, sade butonlar
- Kullanıcı alışkanlıklarına uygun yapı:
  - Giriş ekranı çoğu SaaS uygulamasına benzesin
  - Mesaj baloncukları Telegram hissiyatı versin
  - Minimalist ve düz tasarım (Google, ChatGpt tarzı): AI odaklı olduğu için içeriğe dikkat cekmemiz gerekiyor.

## 🟠 Tasarım Yasaları & UX Prensipleri

1. Hick's Law (Seçim Azaltma) 🎯
   Ne kadar çok seçenek verirsen, karar süresi o kadar uzar.
   ✔ Daha az buton, daha hızlı karar!
   ✔ Kullanıcıya gereksiz seçimler sunma.
   ✔ Menüyü açık ve basit tut.
   Örnek:
   Amazon 1-Click Purchase butonu = Sonsuz seçenek yerine tek tıkla satın alma!

2. Fitts's Law (Büyük ve Yakın Hedefler) 🏹
   Bir şey ne kadar büyükse ve ne kadar yakındaysa, ona tıklamak o kadar kolaydır.
   ✔ Butonları büyük yap.
   ✔ En önemli aksiyon butonlarını yakın yerleştir.
   ✔ Kullanıcıyı fareyle/klavyeyle gezdirmeye zorlama!
   Örnek:
   "Satın Al" butonu her zaman büyük ve belirgin olur.
   MacOS’ta köşedeki "Apple Menüsü" sonsuz büyük gibi hissedilir.

3. Jakob's Law (Alışkanlıkları Kullan) 🔄
   Kullanıcılar başka sitelerde öğrendiği şeyleri senin sitende de görmek ister.
   ✔ "Sepet" hep sağ üstte olmalı.
   ✔ "Ana Sayfa" logosu sol üstte olmalı.
   ✔ Kullanıcıyı yeni bir sistem öğrenmeye zorlama.
   Örnek:
   Google, Facebook, Amazon gibi büyük siteler hep benzer menüleri kullanır.

4. Serial Position Effect (Başı ve Sonu Hatırla) 🧠
   İnsan beyni, bir listenin başını ve sonunu daha iyi hatırlar.
   ✔ Önemli şeyleri başa ve sona koy!
   ✔ Menüde ilk ve son seçenek en kritik olmalı.
   Örnek:
   Menüde "Profil" ve "Çıkış Yap" genelde sonda olur.
   Mobilde "Ana Sayfa" hep ilk sırada yer alır.

5. Doherty Threshold (0.4 Saniye Kuralı) ⏳
   0.4 saniye içinde tepki ver, kullanıcıyı bekletme!
   ✔ Sistem yarım saniyede cevap vermezse, kullanıcı sıkılır.
   ✔ Yükleme animasyonu koy (beklemeyi hissettirme).
   Örnek:
   Google, sorguyu anında çalıştırır ve yükleme animasyonu göstermez.
   Instagram'da resimler anında yüklenir gibi görünür, ama arkada yükleniyordur.

6. Law of Prägnanz (Beyin Kolayı Sever) 🔵🔴🟡
   Beyin her şeyi en basit haliyle algılar.
   ✔ Az renk, net kontrast.
   ✔ Karmaşık şekiller yerine basit ikonlar.
   ✔ Fazla detaylı grafikler yerine düz formlar.
   Örnek:
   Google’ın logosu sadece basit renklerden oluşur.
   iPhone simgeleri köşeleri yuvarlatılmış karelerdir.

7. KISS (Keep It Simple, Stupid) 😎
   Ne kadar basitse, o kadar iyidir.
   ✔ Sadece GEREKLİ olan şeyleri göster.
   ✔ Fazla süsleme, fazla detay = mental yük.
   ✔ UI’de "gereksiz bilgi" ve "fazladan seçenek" bırakma!
   Örnek:
   Apple’ın minimalist tasarımları.
   Google’ın ana sayfasında sadece arama kutusu var.

8. Miller’s Law (7±2 Kuralı) 🔢
   Bir insanın kısa süreli hafızasında en fazla 7 bilgi tutabilir.
   ✔ Menüde en fazla 5-7 seçenek kullan.
   ✔ Uzun formlar yerine kısa ve bölümlere ayrılmış formlar kullan.
   Örnek:
   Telefon rehberleri numaraları gruplandırır (123-456-7890).
   Amazon, kategorileri aşırı bölümlere ayırmaz, tek seferde az gösterir.

9. Zeigarnik Effect (Eksik Şeyler Dikkat Çeker) 🔍
   Tamamlanmamış şeyler akılda daha çok kalır.
   ✔ İnsanlara eksik bıraktıkları bir şeyi hatırlat.
   ✔ Örneğin, profil tamamlanmamışsa %75 tamamlandı yaz.
   Örnek:
   LinkedIn: "Profiliniz %85 tamamlandı!"
   Duolingo: "Bugünlük serini devam ettirmek ister misin?"

10. Gestalt Principles (Bütünlük Algısı) 🏗️
    İnsan beyni her zaman parçaları bir bütün olarak görmek ister.
    ✔ İlgili şeyleri gruplandır.
    ✔ Beyaz alanları (boşlukları) kullan.
    ✔ Düzensiz tasarımlar yerine simetriyi koru.
    Örnek:
    iPhone uygulama simgeleri hizalıdır ve eşit aralıklıdır.
    Butonlar aynı yükseklikte ve genişlikte olursa kullanıcı için sezgisel olur.

Mental Enerji Minimuma Nasıl İner? ⚡

✔ Seçenekleri azalt (Hick's Law).
✔ Butonları büyük ve ulaşılabilir yap (Fitts's Law).
✔ Alışkanlıklara uygun ol (Jakob's Law).
✔ En önemli şeyleri başa ve sona koy (Serial Position Effect).
✔ Sistemi 0.4 saniyede tepki verecek kadar hızlı yap (Doherty Threshold).
✔ Beyni yormayan, basit şekiller ve renkler kullan (Law of Prägnanz).
✔ Sadelik en iyisidir (KISS).
✔ 7’den fazla bilgi sunma (Miller’s Law).
✔ Eksik kalan şeyleri vurgula (Zeigarnik Effect).
✔ Her şeyi düzenli ve hizalı yap (Gestalt Principles).

Eğer bu kuralları uygularsan, insan beyni sıfır enerjiyle arayüzü anlayabilir.
Ve kullanıcı en hızlı şekilde amacına ulaşır. 🚀🔥

https://chatgpt.com/c/67b79455-0838-8002-8960-d6d54ae18cac

## Alisilmis Olani Tercih Et

- Deneyimi basitleştirmek için bilinçli olarak “alışılmış” tasarım kalıpları tercih et
- İnsan beyni alışılmış düzenleri tercih eder
- Eğer her site radikal bir tasarım yapsaydı, insanlar her yeni sitede öğrenmek zorunda kalırdı ve bu beyin için yorucu olurdu.
- Telefonlarda "ayarlar" hep dişli çark simgesiyle gösterilir. Eğer biri bunu balık ikonu yapsa, ilk anda anlaman zor olurdu.

## 🔴 Aesthetic-Usability Effect (Estetik Kullanılabilirliği Artırır)

Kullanıcılar güzel görünen arayüzleri daha kullanışlı olduğunu düşünme eğilimindedir.
Kullanıcıya ilk iyi izlenimi vermezsen, ne kadar kullanışlı olursa olsun deneyimi kötü algılarlar.
✔ UI’nin sade ve modern görünmesi kullanıcı deneyimini artırır.
✔ İyi tasarlanmış düğmeler, boşluklar ve hizalama ile algılanan kaliteyi artır.
Örnek: Apple ürünleri görsel olarak mükemmel tasarlandığı için kullanıcı deneyimi yüksek algılanıyor.

## 🟢 Tesler’s Law (Kompleksite Korunumu Yasası)

Sistemdeki toplam karmaşıklık asla azalmaz, sadece farklı yerlere dağıtılır.
✔ Eğer tasarımı sadelestiriyorsan, kompleksiteyi sistem tarafında yönetmelisin.
Örnek: Google Arama ana sayfası aşırı sade görünür, ancak arka planda milyonlarca hesaplama yapar.

## ⚫ Parkinson’s Law (İş Süreyi Doldurur)

Kullanıcılara gerekli olmayan uzun süreler verilirse, gereksiz vakit kaybederler.
✔ İşlemleri hızlandırmak için gereksiz beklemeleri kaldır.
✔ Kullanıcıya az ama etkili aksiyonlar sun.
Örnek: LinkedIn, profil tamamlama sürecini hızlandırmak için otomatik öneriler sunar.

## 🟡 Peak-End Rule (Deneyimin Sonu Önemlidir)

Kullanıcılar bir deneyimi tamamen değil, en yoğun ve en son anlarına göre hatırlar.
✔ Kullanıcının etkileşimi sonlandığında olumlu bir his bırak (örneğin, başarılı işlemlerde mini kutlama efektleri kullan).
Örnek: Duolingo, ders sonunda coşkulu kutlamalar ekleyerek kullanıcıların deneyimi iyi hatırlamasını sağlar.
