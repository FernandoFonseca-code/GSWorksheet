var CookieSalesManager = /** @class */ (function () {
    function CookieSalesManager() {
        this.cookieSales = [];
        this.PRICE_PER_PKG = 6.00;
        this.initializeCookieTypes();
        this.setupEventListeners();
    }
    CookieSalesManager.prototype.initializeCookieTypes = function () {
        var cookieTypes = [
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
        this.cookieSales = cookieTypes.map(function (type) { return ({
            cookieType: type,
            startCases: 0,
            startPkgs: 0,
            finishCases: 0,
            finishPkgs: 0,
            totalPkgsSold: 0,
            revenue: 0
        }); });
        this.renderTable();
    };
    CookieSalesManager.prototype.setupEventListeners = function () {
        var _this = this;
        var form = document.getElementById('cookieSalesForm');
        form === null || form === void 0 ? void 0 : form.addEventListener('submit', function (e) {
            e.preventDefault();
            _this.saveChanges();
        });
    };
    CookieSalesManager.prototype.renderTable = function () {
        var tbody = document.getElementById('cookieSalesBody');
        if (!tbody)
            return;
        tbody.innerHTML = '';
        this.cookieSales.forEach(function (sale, index) {
            var row = document.createElement('tr');
            row.innerHTML = "\n                <td><input type=\"text\" value=\"".concat(sale.cookieType, "\" readonly class=\"form-control\" /></td>\n                <td><input type=\"number\" value=\"").concat(sale.startCases, "\" class=\"form-control\" data-index=\"").concat(index, "\" data-field=\"startCases\" /></td>\n                <td><input type=\"number\" value=\"").concat(sale.startPkgs, "\" class=\"form-control\" data-index=\"").concat(index, "\" data-field=\"startPkgs\" /></td>\n                <td><input type=\"number\" value=\"").concat(sale.finishCases, "\" class=\"form-control\" data-index=\"").concat(index, "\" data-field=\"finishCases\" /></td>\n                <td><input type=\"number\" value=\"").concat(sale.finishPkgs, "\" class=\"form-control\" data-index=\"").concat(index, "\" data-field=\"finishPkgs\" /></td>\n                <td><input type=\"number\" value=\"").concat(sale.totalPkgsSold, "\" readonly class=\"form-control\" /></td>\n                <td><input type=\"number\" value=\"").concat(sale.revenue.toFixed(2), "\" readonly class=\"form-control\" /></td>\n            ");
            tbody.appendChild(row);
        });
        this.addInputListeners();
        this.updateTotals();
    };
    CookieSalesManager.prototype.addInputListeners = function () {
        var _this = this;
        var inputs = document.querySelectorAll('input[type="number"]:not([readonly])');
        inputs.forEach(function (input) {
            input.addEventListener('change', function (e) {
                var target = e.target;
                var index = parseInt(target.dataset.index || '0');
                var field = target.dataset.field;
                var value = parseInt(target.value) || 0;
                if (_this.cookieSales[index]) {
                    _this.cookieSales[index][field] = value;
                    // Only calculate individual row total when finish packages are entered
                    if (field === 'finishPkgs') {
                        _this.calculateSales(index);
                        _this.updateRowTotal(index);
                    }
                }
            });
        });
    };
    CookieSalesManager.prototype.calculateSales = function (index) {
        var sale = this.cookieSales[index];
        var startTotal = (sale.startCases * 12) + sale.startPkgs;
        var finishTotal = (sale.finishCases * 12) + sale.finishPkgs;
        sale.totalPkgsSold = startTotal - finishTotal;
        sale.revenue = sale.totalPkgsSold * this.PRICE_PER_PKG;
    };
    CookieSalesManager.prototype.updateRowTotal = function (index) {
        var row = document.querySelector("#cookieSalesBody tr:nth-child(".concat(index + 1, ")"));
        if (row) {
            // Fix: Select inputs by their position in the row instead of by value
            var totalPkgsInput = row.querySelectorAll('input')[5]; // 6th input (0-based index)
            var revenueInput = row.querySelectorAll('input')[6]; // 7th input
            if (totalPkgsInput)
                totalPkgsInput.value = this.cookieSales[index].totalPkgsSold.toString();
            if (revenueInput)
                revenueInput.value = this.cookieSales[index].revenue.toFixed(2);
        }
    };
    CookieSalesManager.prototype.updateTotals = function () {
        var totalPkgsSold = this.cookieSales.reduce(function (sum, sale) { return sum + sale.totalPkgsSold; }, 0);
        var totalRevenue = this.cookieSales.reduce(function (sum, sale) { return sum + sale.revenue; }, 0);
        var totalPkgsElement = document.getElementById('totalPkgsSold');
        var totalRevenueElement = document.getElementById('totalRevenue');
        if (totalPkgsElement)
            totalPkgsElement.textContent = totalPkgsSold.toString();
        if (totalRevenueElement)
            totalRevenueElement.textContent = totalRevenue.toFixed(2);
    };
    CookieSalesManager.prototype.saveChanges = function () {
        var _this = this;
        // Calculate totals for all rows
        this.cookieSales.forEach(function (_, index) {
            _this.calculateSales(index);
        });
        // Update the overall totals only when saving
        this.updateTotals();
        console.log('Saving changes:', this.cookieSales);
    };
    return CookieSalesManager;
}());
// Initialize the manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    new CookieSalesManager();
});
