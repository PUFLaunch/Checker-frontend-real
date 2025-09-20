# $PUF Stats Dashboard

World tabanlı kripto para için minimalist istatistik dashboard'u.

## 🚀 Özellikler

- **Burnt Tokens**: Yakılan token miktarı
- **Treasury**: Hazineye eklenen miktar  
- **Creator Earnings**: Dağıtılan yaratıcı kazançları
- Real-time veri güncelleme (15 saniyede bir)
- Responsive tasarım
- Web-view uyumlu
- Minimalist ve modern UI

## 📱 Kullanım

### Web-view için:
Sadece `index.html` dosyasını web-view'da açın. Tüm dosyalar tek klasörde bulunmalı.

### Tarayıcı için:
Dosyaları bir web sunucusunda host edin veya `index.html` dosyasını doğrudan açın.

## 🔧 API Entegrasyonu

`script.js` dosyasındaki `apiEndpoints` objesini gerçek API URL'lerinizle güncelleyin:

```javascript
this.apiEndpoints = {
    stats: 'https://your-api.com/puf/stats',
    // veya ayrı endpoint'ler:
    burnt: 'https://your-api.com/puf/burnt',
    treasury: 'https://your-api.com/puf/treasury', 
    earnings: 'https://your-api.com/puf/earnings'
};
```

### Beklenen API Response Formatı:

```json
{
    "burnt": 5500000,
    "treasury": 2750000,
    "earnings": 4250000
}
```

## 🎨 Özelleştirme

### Renkleri değiştirmek:
`style.css` dosyasındaki CSS değişkenlerini düzenleyin:

```css
.stat-card.burnt {
    --accent-color: #ff6b6b;
    --accent-light: #ff8a8a;
}
```

### Güncelleme sıklığını değiştirmek:
`script.js` dosyasında:

```javascript
this.refreshInterval = 15000; // milisaniye cinsinden
```

## 📂 Dosya Yapısı

```
/
├── index.html      # Ana HTML dosyası
├── style.css       # Stil dosyası
├── script.js       # JavaScript fonksiyonları
└── README.md       # Bu dosya
```

## 🔄 Auto-refresh

Dashboard otomatik olarak 15 saniyede bir güncellenir. Bu süre `script.js` dosyasından değiştirilebilir.

## 🌐 Tarayıcı Uyumluluğu

- ✅ Chrome/Chromium tabanlı
- ✅ Firefox  
- ✅ Safari
- ✅ Mobile browsers
- ✅ Web-view (iOS/Android)

## 💡 İpuçları

- Web-view performansı için GPU acceleration aktif
- Smooth animasyonlar için CSS transforms kullanılıyor
- Loading states kullanıcı deneyimini iyileştiriyor
- Error handling ile güvenilir çalışma

---

**Not**: Şu anda demo veriler kullanılıyor. Gerçek API bağlantısı için yukarıdaki adımları takip edin.
