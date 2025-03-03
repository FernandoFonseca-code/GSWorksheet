interface CookieSale {
    cookieType: string;
    startCases: number;
    startPkgs: number;
    finishCases: number;
    finishPkgs: number;
    totalPkgsSold: number;
    revenue: number;
}

class CookieSalesManager {
    private cookieSales: CookieSale[] = [];
    private readonly PRICE_PER_PKG = 6.00;

    constructor() {
        this.initializeCookieTypes();
        this.setupEventListeners();
    }

    private initializeCookieTypes() {
        const cookieTypes = [
            'Adventurefuls',
            'Lemon-Ups',
            'Trefoils',
            'Do-si-dos',
            'Samoas',
            'Tagalongs',
            'Thin Mints',
            'S\'mores',
            'Toffee-tastic',           
        ];

        this.cookieSales = cookieTypes.map(type => ({
            cookieType: type,
            startCases: 0,
            startPkgs: 0,
            finishCases: 0,
            finishPkgs: 0,
            totalPkgsSold: 0,
            revenue: 0
        }));

        this.renderTable();
    }

    private setupEventListeners() {
        const form = document.getElementById('cookieSalesForm');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveChanges();
        });
    }

    private renderTable() {
        const tbody = document.getElementById('cookieSalesBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        this.cookieSales.forEach((sale, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="text" value="${sale.cookieType}" readonly class="form-control" /></td>
                <td><input type="number" value="${sale.startCases}" class="form-control" data-index="${index}" data-field="startCases" /></td>
                <td><input type="number" value="${sale.startPkgs}" class="form-control" data-index="${index}" data-field="startPkgs" /></td>
                <td><input type="number" value="${sale.finishCases}" class="form-control" data-index="${index}" data-field="finishCases" /></td>
                <td><input type="number" value="${sale.finishPkgs}" class="form-control" data-index="${index}" data-field="finishPkgs" /></td>
                <td><input type="number" value="${sale.totalPkgsSold}" readonly class="form-control" /></td>
                <td><input type="number" value="${sale.revenue.toFixed(2)}" readonly class="form-control" /></td>
            `;
            tbody.appendChild(row);
        });

        this.addInputListeners();
        this.updateTotals();
    }

    private addInputListeners() {
        const inputs = document.querySelectorAll('input[type="number"]:not([readonly])');
        inputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                const index = parseInt(target.dataset.index || '0');
                const field = target.dataset.field as keyof Pick<CookieSale, 'startCases' | 'startPkgs' | 'finishCases' | 'finishPkgs'>;
                const value = parseInt(target.value) || 0;

                if (this.cookieSales[index]) {
                    this.cookieSales[index][field] = value;
                    
                    // Only calculate individual row total when finish packages are entered
                    if (field === 'finishPkgs') {
                        this.calculateSales(index);
                        this.updateRowTotal(index);
                    }
                }
            });
        });
    }

    private calculateSales(index: number) {
        const sale = this.cookieSales[index];
        const startTotal = (sale.startCases * 12) + sale.startPkgs;
        const finishTotal = (sale.finishCases * 12) + sale.finishPkgs;
        sale.totalPkgsSold = startTotal - finishTotal;
        sale.revenue = sale.totalPkgsSold * this.PRICE_PER_PKG;
    }

    private updateRowTotal(index: number) {
        const row = document.querySelector(`#cookieSalesBody tr:nth-child(${index + 1})`);
        if (row) {
            // Fix: Select inputs by their position in the row instead of by value
            const totalPkgsInput = row.querySelectorAll('input')[5] as HTMLInputElement; // 6th input (0-based index)
            const revenueInput = row.querySelectorAll('input')[6] as HTMLInputElement;   // 7th input
            
            if (totalPkgsInput) totalPkgsInput.value = this.cookieSales[index].totalPkgsSold.toString();
            if (revenueInput) revenueInput.value = this.cookieSales[index].revenue.toFixed(2);
        }
    }

    private updateTotals() {
        const totalPkgsSold = this.cookieSales.reduce((sum, sale) => sum + sale.totalPkgsSold, 0);
        const totalRevenue = this.cookieSales.reduce((sum, sale) => sum + sale.revenue, 0);

        const totalPkgsElement = document.getElementById('totalPkgsSold');
        const totalRevenueElement = document.getElementById('totalRevenue');

        if (totalPkgsElement) totalPkgsElement.textContent = totalPkgsSold.toString();
        if (totalRevenueElement) totalRevenueElement.textContent = totalRevenue.toFixed(2);
    }

    private saveChanges() {
        // Calculate totals for all rows
        this.cookieSales.forEach((_, index) => {
            this.calculateSales(index);
        });

        // Update the overall totals only when saving
        this.updateTotals();

        console.log('Saving changes:', this.cookieSales);
    }
}

// Initialize the manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CookieSalesManager();
});
