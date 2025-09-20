# 💎 $PUF Stats Dashboard

$PUF tokeninin tokenomik verilerini izleyen minimal web dashboard'u.

## 📊 Özellikler

- **Burned Amount** (Turuncu) - Yakılan token miktarı
- **Treasury Amount** (Yeşil) - Hazineye giden miktar  
- **Creator Royalties** (Mavi) - Yaratıcılara dağıtılan telif hakları
- **Token Fiyatı** - Anlık $PUF token fiyatı
- **Otomatik Yenileme** - Her 30 saniyede bir güncelleme
- **Responsive Tasarım** - Mobil uyumlu

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

## 📝 Yapılacaklar

- [ ] $PUF blockchain API entegrasyonu
- [ ] Gerçek endpoint'ler bağlantısı
- [ ] Error handling iyileştirmeleri
- [ ] Grafik görselleştirmeleri (opsiyonel)

## 🔄 Güncelleme

Veriler şu anda mock data ile çalışıyor. API endpoint'leri hazır olduğunda `script.js` dosyasındaki ilgili fonksiyonlar güncellenecek.
