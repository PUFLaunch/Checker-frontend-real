// $PUF Stats Dashboard JavaScript
class PufStatsApp {
    constructor() {
        this.apiEndpoints = {
            // Bu endpoint'leri gerçek API URL'lerinizle değiştireceksiniz
            stats: 'https://api.example.com/puf/stats',
            // Alternative: Ayrı endpoint'ler kullanılacaksa
            burnt: 'https://api.example.com/puf/burnt',
            treasury: 'https://api.example.com/puf/treasury',
            earnings: 'https://api.example.com/puf/earnings'
        };
        
        this.elements = {
            burntValue: document.getElementById('burnt-value'),
            treasuryValue: document.getElementById('treasury-value'),
            earningsValue: document.getElementById('earnings-value'),
            lastUpdate: document.getElementById('last-update')
        };
        
        this.refreshInterval = 15000; // 15 saniyede bir güncelle (web-view için daha hızlı)
        this.init();
    }
    
    init() {
        console.log('🚀 $PUF Stats Dashboard başlatılıyor...');
        this.loadStats();
        this.startAutoRefresh();
        this.setupErrorHandling();
    }
    
    async loadStats() {
        try {
            this.showLoadingState();
            
            // Mock data - gerçek API'ye bağlandığınızda bu kısmı değiştireceksiniz
            const mockData = await this.getMockData();
            
            // Gerçek API kullanımı için bu satırı açın:
            // const data = await this.fetchFromAPI();
            
            this.updateUI(mockData);
            this.updateLastUpdateTime();
            console.log('📊 Veriler başarıyla yüklendi');
            
        } catch (error) {
            console.error('❌ Veri yüklenirken hata:', error);
            this.showErrorState();
        }
    }
    
    async fetchFromAPI() {
        // Tek endpoint kullanımı
        const response = await fetch(this.apiEndpoints.stats);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
        
        // Alternatif: Birden fazla endpoint kullanımı
        /*
        const [burntRes, treasuryRes, earningsRes] = await Promise.all([
            fetch(this.apiEndpoints.burnt),
            fetch(this.apiEndpoints.treasury),
            fetch(this.apiEndpoints.earnings)
        ]);
        
        return {
            burnt: await burntRes.json(),
            treasury: await treasuryRes.json(),
            earnings: await earningsRes.json()
        };
        */
    }
    
    async getMockData() {
        // Demo için mock data - gerçek API bağlandığında silinecek
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    burnt: Math.floor(Math.random() * 1000000) + 5000000,
                    treasury: Math.floor(Math.random() * 500000) + 2000000,
                    earnings: Math.floor(Math.random() * 750000) + 3500000
                });
            }, 1000);
        });
    }
    
    updateUI(data) {
        this.elements.burntValue.textContent = this.formatNumber(data.burnt);
        this.elements.treasuryValue.textContent = this.formatNumber(data.treasury);
        this.elements.earningsValue.textContent = this.formatNumber(data.earnings);
        
        // Loading state'i kaldır
        this.removeLoadingState();
    }
    
    formatNumber(num) {
        if (num >= 1e9) {
            return (num / 1e9).toFixed(2) + 'B';
        }
        if (num >= 1e6) {
            return (num / 1e6).toFixed(2) + 'M';
        }
        if (num >= 1e3) {
            return (num / 1e3).toFixed(2) + 'K';
        }
        return num.toLocaleString();
    }
    
    showLoadingState() {
        Object.values(this.elements).forEach(element => {
            if (element && element.id !== 'last-update') {
                element.classList.add('loading');
            }
        });
    }
    
    removeLoadingState() {
        Object.values(this.elements).forEach(element => {
            if (element) {
                element.classList.remove('loading');
            }
        });
    }
    
    showErrorState() {
        this.elements.burntValue.textContent = 'Hata!';
        this.elements.treasuryValue.textContent = 'Hata!';
        this.elements.earningsValue.textContent = 'Hata!';
        this.removeLoadingState();
    }
    
    updateLastUpdateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('tr-TR');
        this.elements.lastUpdate.textContent = timeString;
    }
    
    startAutoRefresh() {
        setInterval(() => {
            console.log('🔄 Otomatik güncelleme...');
            this.loadStats();
        }, this.refreshInterval);
    }
    
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global hata:', event.error);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Promise hatası:', event.reason);
        });
    }
}

// Uygulama yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    new PufStatsApp();
});

// Web-view için özel optimizasyonlar
if (window.webkit && window.webkit.messageHandlers) {
    console.log('📱 Web-view ortamında çalışıyor');
    // Web-view özel kodları buraya eklenebilir
}
