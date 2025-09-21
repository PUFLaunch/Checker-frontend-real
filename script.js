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
            console.log('💰 Token fiyatı DexScreener\'dan getiriliyor...');
            
            // DexScreener API endpoint for PUF token on Worldchain
            const pairAddress = '0x1D3bdD97F3772EAbe2c039476805376e788374d8';
            const apiUrl = `https://api.dexscreener.com/latest/dex/pairs/worldchain/${pairAddress}`;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`DexScreener API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            // API'den gelen veriyi kontrol et
            if (data && data.pairs && data.pairs.length > 0) {
                const pair = data.pairs[0];
                const price = parseFloat(pair.priceUsd);
                
                if (price && !isNaN(price)) {
                    console.log(`✅ $PUF fiyatı: $${price}`);
                    
                    // 24 saatlik değişim bilgisini al
                    const priceChange24h = pair.priceChange?.h24;
                    
                    this.updateTokenPrice(price, priceChange24h);
                    
                    // Ek bilgileri de konsola yazdır
                    console.log('📊 Ek DexScreener verileri:', {
                        dex: pair.dexId,
                        liquidity: pair.liquidity?.usd ? `$${pair.liquidity.usd.toLocaleString()}` : 'N/A',
                        volume24h: pair.volume?.h24 ? `$${pair.volume.h24.toLocaleString()}` : 'N/A',
                        priceChange24h: priceChange24h ? `${priceChange24h}%` : 'N/A'
                    });
                } else {
                    throw new Error('Geçersiz fiyat verisi');
                }
            } else {
                throw new Error('Pair verisi bulunamadı');
            }
            
        } catch (error) {
            console.error('❌ Token fiyat hatası:', error);
            
            // Hata durumunda fallback - mock data kullan
            console.log('🔄 Fallback: Mock data kullanılıyor...');
            const fallbackPrice = this.mockData.tokenPrice;
            this.updateTokenPrice(fallbackPrice);
            
            // Hata göstergesi ekle
            const priceElement = document.getElementById('tokenPrice');
            if (priceElement) {
                priceElement.style.color = '#ff9800'; // Turuncu renk hata için
                priceElement.title = 'Fiyat verisi geçici olarak erişilemez';
            }
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

    updateTokenPrice(price, priceChange24h = null) {
        const priceElement = document.getElementById('tokenPrice');
        if (priceElement) {
            // Fiyatı göster
            priceElement.textContent = `$${price.toFixed(6)}`;
            priceElement.classList.remove('loading');
            
            // Normal rengi geri getir (error durumundan sonra)
            priceElement.style.color = '#4CAF50';
            priceElement.title = '';
            
            // Eğer 24 saatlik değişim varsa, header'a ekle
            if (priceChange24h !== null && !isNaN(priceChange24h)) {
                this.updatePriceChange(priceChange24h);
            }
        }
    }
    
    updatePriceChange(priceChange24h) {
        const tokenInfo = document.querySelector('.token-info');
        if (!tokenInfo) return;
        
        // Mevcut price change elementini kaldır
        const existingChange = tokenInfo.querySelector('.price-change');
        if (existingChange) {
            existingChange.remove();
        }
        
        // Yeni price change elementi oluştur
        const priceChangeElement = document.createElement('div');
        priceChangeElement.className = 'price-change';
        
        const changeValue = parseFloat(priceChange24h);
        const isPositive = changeValue >= 0;
        
        priceChangeElement.innerHTML = `
            <span class="change-label">24h:</span>
            <span class="change-value ${isPositive ? 'positive' : 'negative'}">
                ${isPositive ? '+' : ''}${changeValue.toFixed(2)}%
            </span>
        `;
        
        tokenInfo.appendChild(priceChangeElement);
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
