# 💎 $PUF Stats Dashboard (React)

$PUF tokeninin tokenomik verilerini izleyen React tabanlı modern web dashboard'u.

## 📊 Özellikler

- **Burned Amount** (Turuncu) - Yakılan token miktarı
- **Treasury Amount** (Yeşil) - Hazineye giden miktar
- **Creator Royalties** (Mavi) - Yaratıcılara dağıtılan telif hakları
- **Token Fiyatı** - Anlık $PUF token fiyatı
- **Manuel Veri Yükleme** - Sayfa yüklendiğinde veri çekme
- **Ultra Responsive** - Mobil uyumlu, kaydırma gerektirmez
- **Modern React** - Bileşen tabanlı, state yönetimi ile

## 🚀 Kullanım

1. **Dependencies yükleyin:**
   ```bash
   npm install
   ```

2. **Development server'ı başlatın:**
   ```bash
   npm start
   ```

3. **Tarayıcıda açın:**
   ```
   http://localhost:3000
   ```

## 🔧 Teknik Detaylar

- **Token:** $PUF
- **Blockchain:** World Network (QuikNode RPC)
- **Framework:** React 18
- **Blockchain Library:** Ethers.js v6
- **Tema:** Siyah/Beyaz minimal tasarım
- **State Management:** React Hooks
- **API:** DexScreener + Custom Tokenomics API

## 🎨 Renk Kodları

- **Burned:** `#FF6B35` (Turuncu)
- **Treasury:** `#4CAF50` (Yeşil)  
- **Royalties:** `#2196F3` (Mavi)
- **Background:** `#0a0a0a` (Siyah)
- **Cards:** `#1a1a1a` (Koyu gri)

## ⌨️ Özellikler

- Sayfa yenileme ile veri güncelleme

## 📱 Mobile Optimizasyon

Dashboard, tüm ekran boyutlarında kaydırma gerektirmeyecek şekilde optimize edilmiştir:
- **768px altı:** Kompakt kart düzeni
- **480px altı:** Footer gizleme, küçültülmüş fontlar
- **360px altı:** Ultra kompakt görünüm  
- **Kısa ekranlar:** Yükseklik bazlı optimizasyon

## 📝 Yapılacaklar

- [x] React'e dönüştürme ✅
- [ ] $PUF blockchain API entegrasyonu
- [ ] Gerçek endpoint'ler bağlantısı
- [ ] Error handling iyileştirmeleri
- [ ] Grafik görselleştirmeleri (opsiyonel)
- [ ] TypeScript desteği (opsiyonel)  

## 🔄 Güncelleme

Veriler şu anda mock data ile çalışıyor. API endpoint'leri hazır olduğunda `src/App.js` dosyasındaki ilgili fonksiyonlar güncellenecek.
