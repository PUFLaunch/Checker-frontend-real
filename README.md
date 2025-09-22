# 💎 $PUF Stats Dashboard

$PUF tokeninin tokenomik verilerini izleyen minimal web dashboard'u.

## 📊 Özellikler

- **Burned Amount** (Turuncu) - Yakılan token miktarı
- **Treasury Amount** (Yeşil) - Hazineye giden miktar  
- **Creator Royalties** (Mavi) - Yaratıcılara dağıtılan telif hakları
- **Token Fiyatı** - Anlık $PUF token fiyatı
- **Otomatik Yenileme** - Her 30 saniyede bir güncelleme
- **Ultra Responsive** - Mobil uyumlu, kaydırma gerektirmez

## 🚀 Kullanım

1. **Basit Çalıştırma:**
   ```bash
   # Dosyaları bir web sunucusu ile çalıştırın
   python -m http.server 8000
   # veya
   npx serve .
   ```

2. **Tarayıcıda açın:**
   ```
   http://localhost:8000
   ```

## 🔧 Teknik Detaylar

- **Token:** $PUF
- **Blockchain:** World Network
- **Tema:** Siyah/Beyaz minimal tasarım
- **API:** Placeholder (sonradan eklenecek)

## 🎨 Renk Kodları

- **Burned:** `#FF6B35` (Turuncu)
- **Treasury:** `#4CAF50` (Yeşil)  
- **Royalties:** `#2196F3` (Mavi)
- **Background:** `#0a0a0a` (Siyah)
- **Cards:** `#1a1a1a` (Koyu gri)

## ⌨️ Klavye Kısayolları

- **ESC** - Manuel veri yenileme (otomatik yenileme her 30 saniyede)

## 📱 Mobile Optimizasyon

Dashboard, tüm ekran boyutlarında kaydırma gerektirmeyecek şekilde optimize edilmiştir:
- **768px altı:** Kompakt kart düzeni
- **480px altı:** Footer gizleme, küçültülmüş fontlar
- **360px altı:** Ultra kompakt görünüm  
- **Kısa ekranlar:** Yükseklik bazlı optimizasyon

## 📝 Yapılacaklar

- [ ] $PUF blockchain API entegrasyonu
- [ ] Gerçek endpoint'ler bağlantısı
- [ ] Error handling iyileştirmeleri
- [ ] Grafik görselleştirmeleri (opsiyonel) 

## 🔄 Güncelleme

Veriler şu anda mock data ile çalışıyor. API endpoint'leri hazır olduğunda `script.js` dosyasındaki ilgili fonksiyonlar güncellenecek.
