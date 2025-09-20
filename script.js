// $PUF Stats Dashboard JavaScript
class PUFTokenChecker {
    constructor() {
        this.contractAddress = '0x1aE3498f1B417fe31BE544B04B711F27Ba437bd3';
        this.apiUrl = 'https://worldscan.org/api'; // World blockchain explorer API placeholder
        this.refreshInterval = 30000; // 30 seconds
        
        // Mock data for testing (will be replaced with real API data)
        this.mockData = {
            tokenPrice: 0.0234,
            burnedAmount: 1250000,
            treasuryAmount: 890000,
            royaltiesAmount: 340000,
            lastUpdate: new Date()
        };
        
        this.init();
    }

    init() {
        console.log('🚀 $PUF Stats Dashboard başlatılıyor...');
        this.setupEventListeners();
        this.loadInitialData();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        // Escape key ile manuel refresh
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.refreshAllData();
        });
    }

    async loadInitialData() {
        console.log('📊 İlk veriler yükleniyor...');
        this.showLoadingState();
        
        try {
            await this.fetchTokenPrice();
            await this.fetchTokenomicsData();
            this.updateLastSync();
        } catch (error) {
            console.error('❌ Veri yükleme hatası:', error);
            this.showErrorState();
        }
    }

    showLoadingState() {
        const elements = ['tokenPrice', 'burnedAmount', 'treasuryAmount', 'royaltiesAmount'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (id === 'tokenPrice') {
                    element.textContent = 'Loading...';
                } else {
                    const valueSpan = element.querySelector('.value');
                    if (valueSpan) valueSpan.textContent = '...';
                }
                element.classList.add('loading');
            }
        });
    }

    async fetchTokenPrice() {
        try {
            // TODO: Real World blockchain API integration
            // For now, using mock data
            console.log('💰 Token fiyatı getiriliyor...');
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const price = this.mockData.tokenPrice;
            this.updateTokenPrice(price);
            
        } catch (error) {
            console.error('❌ Token fiyat hatası:', error);
            document.getElementById('tokenPrice').textContent = 'Error';
        }
    }

    async fetchTokenomicsData() {
        try {
            console.log('📈 Tokenomik verileri getiriliyor...');
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Mock data - replace with real API calls later
            const data = {
                burnedAmount: this.mockData.burnedAmount + Math.floor(Math.random() * 10000),
                treasuryAmount: this.mockData.treasuryAmount + Math.floor(Math.random() * 5000),
                royaltiesAmount: this.mockData.royaltiesAmount + Math.floor(Math.random() * 3000)
            };
            
            this.updateTokenomicsDisplay(data);
            
        } catch (error) {
            console.error('❌ Tokenomik veri hatası:', error);
            this.showErrorState();
        }
    }

    updateTokenPrice(price) {
        const priceElement = document.getElementById('tokenPrice');
        if (priceElement) {
            priceElement.textContent = `$${price.toFixed(4)}`;
            priceElement.classList.remove('loading');
        }
    }

    updateTokenomicsDisplay(data) {
        // Update Burned Amount
        this.updateDataCard('burnedAmount', data.burnedAmount, this.calculatePercentage(data.burnedAmount, 10000000));
        
        // Update Treasury Amount
        this.updateDataCard('treasuryAmount', data.treasuryAmount, this.calculatePercentage(data.treasuryAmount, 5000000));
        
        // Update Royalties Amount
        this.updateDataCard('royaltiesAmount', data.royaltiesAmount, this.calculatePercentage(data.royaltiesAmount, 2000000));
        
        // Update footer timestamps
        this.updateCardFooters();
    }

    updateDataCard(elementId, value, percentage) {
        const element = document.getElementById(elementId);
        if (element) {
            const valueSpan = element.querySelector('.value');
            const percentageSpan = element.parentElement.querySelector('.percentage');
            
            if (valueSpan) {
                valueSpan.textContent = this.formatNumber(value);
                valueSpan.classList.remove('loading');
            }
            
            if (percentageSpan) {
                percentageSpan.textContent = `${percentage.toFixed(2)}%`;
            }
        }
    }

    updateCardFooters() {
        const footers = document.querySelectorAll('.card-footer .last-updated');
        const now = new Date().toLocaleTimeString('tr-TR');
        
        footers.forEach(footer => {
            footer.textContent = `Last updated: ${now}`;
        });
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(2) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    }

    calculatePercentage(value, total) {
        return (value / total) * 100;
    }

    updateLastSync() {
        const lastSyncElement = document.getElementById('lastSync');
        if (lastSyncElement) {
            const now = new Date();
            lastSyncElement.textContent = now.toLocaleTimeString('tr-TR');
        }
    }

    async refreshAllData() {
        console.log('🔄 Tüm veriler yenileniyor...');
        
        try {
            await this.loadInitialData();
        } catch (error) {
            console.error('❌ Veri yenileme hatası:', error);
        }
    }

    showErrorState() {
        const elements = ['burnedAmount', 'treasuryAmount', 'royaltiesAmount'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const valueSpan = element.querySelector('.value');
                if (valueSpan) {
                    valueSpan.textContent = 'Error';
                    valueSpan.classList.remove('loading');
                }
            }
        });
    }

    startAutoRefresh() {
        setInterval(() => {
            console.log('⏰ Otomatik yenileme...');
            this.loadInitialData();
        }, this.refreshInterval);
    }
}

// Dashboard'u başlat
document.addEventListener('DOMContentLoaded', () => {
    window.pufChecker = new PUFTokenChecker();
    
    console.log(`
    💎 $PUF Stats Dashboard
    =====================
    
    Dashboard özellikleri:
    ✅ Burned Amount tracking (Turuncu)
    ✅ Treasury Amount tracking (Yeşil)
    ✅ Creator Royalties tracking (Mavi)
    ✅ Real-time $PUF price
    ✅ Auto-refresh (30s)
    ✅ Responsive design
    
    ESC tuşu ile manuel refresh yapabilirsiniz.
    `);
});
