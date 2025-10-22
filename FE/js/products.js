import { initializeCategories, initializeProduct } from "./data/fetchData.js";
import { addToCart, handleBuyNow } from "./productCardLogic.js";

let categories = [];
let productData = [];
let filteredProducts = [];
const ITEMS_PER_PAGE = 6;
let currentPage = 1;

// ============================
// ⚡ KHỞI TẠO
// ============================
const initApp = async () => {
    productData = await initializeProduct();
    categories = await initializeCategories();
    filteredProducts = productData; // mặc định hiển thị tất cả

    // Gắn sự kiện
    document.querySelector('.sort-select').addEventListener('change', handleSort);

    // Cài đặt và gắn sự kiện cho các bộ lọc
    setupPriceSlider();
    renderCategoryList();

    // Gắn sự kiện cho thanh trượt giá
    // 'input' để cập nhật số hiển thị (khi kéo)
    document.querySelector('#price-slider').addEventListener('input', updatePriceDisplay);
    // 'change' để áp dụng lọc (khi nhả chuột)
    document.querySelector('#price-slider').addEventListener('change', handleFilterChange);

    // Render lần đầu
    applyAllFilters(); // Dùng hàm mới thay vì renderProducts()

    // Đưa các hàm này ra global scope để HTML gọi được
    window.addToCart = addToCart;
    window.handleBuyNow = handleBuyNow;
    window.changePage = changePage;
};

// ============================
// 🧩 RENDER CATEGORY SIDEBAR
// ============================
const renderCategoryList = () => {
    const list = document.querySelector(".sidebar-list");
    list.innerHTML = categories.map(cat => `
        <li>
            <label>
                <input type="checkbox" data-id="${cat.id}">
                ${cat.name}
            </label>
        </li>
    `).join('');

    // Thêm sự kiện khi user click checkbox
    list.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange); // Gọi hàm xử lý chung
    });
};

// ============================
// 🧩 CÀI ĐẶT THANH TRƯỢT GIÁ (MỚI)
// ============================
const setupPriceSlider = () => {
    const slider = document.querySelector('#price-slider');
    const display = document.querySelector('#price-value');

    if (!slider || !display) return;

    // Tìm giá cao nhất (đã giảm) trong tất cả sản phẩm
    const prices = productData.map(p => {
        return p.discount_percentage ? p.price * (100 - p.discount_percentage) / 100 : p.price;
    });
    const maxPrice = Math.ceil(Math.max(...prices)); // Làm tròn lên

    slider.max = maxPrice;
    slider.value = maxPrice;
    display.textContent = `$${maxPrice}`;
};

// ============================
// 🧩 HÀM LỌC TỔNG (MỚI)
// ============================

// Chỉ gọi khi có thay đổi bộ lọc (category, giá)
const handleFilterChange = () => {
    applyAllFilters();
};

// Cập nhật số hiển thị khi kéo slider
const updatePriceDisplay = (event) => {
    document.querySelector('#price-value').textContent = `$${event.target.value}`;
};

// Hàm áp dụng TẤT CẢ bộ lọc (Category và Giá)
const applyAllFilters = () => {
    // 1. Lấy giá trị lọc Category
    const checkedBoxes = document.querySelectorAll('.sidebar-list input[type="checkbox"]:checked');
    const selectedIds = [...checkedBoxes].map(cb => parseInt(cb.dataset.id));

    // 2. Lấy giá trị lọc Price
    const maxPrice = parseInt(document.querySelector('#price-slider').value);

    // 3. Bắt đầu lọc từ danh sách gốc
    let tempProducts = productData;

    // 3a. Lọc theo Category
    if (selectedIds.length > 0) {
        tempProducts = tempProducts.filter(p => selectedIds.includes(p.category_id));
    }

    // 3b. Lọc theo Giá
    tempProducts = tempProducts.filter(p => {
        const price = p.discount_percentage ? p.price * (100 - p.discount_percentage) / 100 : p.price;
        return price <= maxPrice;
    });

    // 4. Lưu kết quả vào biến toàn cục
    filteredProducts = tempProducts;

    // 5. Quay lại trang 1 và render lại
    currentPage = 1;
    applySort(); // Áp dụng sắp xếp hiện tại
    renderProducts(); // Hiển thị kết quả
};

// ============================
// 🧩 PHÂN TRANG
// ============================
const changePage = (page) => {
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    if (page === 'prev') {
        currentPage = Math.max(1, currentPage - 1);
    } else if (page === 'next') {
        currentPage = Math.min(totalPages, currentPage + 1);
    } else {
        currentPage = page;
    }

    renderProducts();
};

// ============================
// 🧩 SẮP XẾP SẢN PHẨM (Đã tách logic)
// ============================
const applySort = () => {
    const sortValue = document.querySelector('.sort-select').value;

    filteredProducts.sort((a, b) => {
        const priceA = a.discount_percentage ? a.price * (100 - a.discount_percentage) / 100 : a.price;
        const priceB = b.discount_percentage ? b.price * (100 - b.discount_percentage) / 100 : b.price;

        switch (sortValue) {
            case "price_asc": return priceA - priceB;
            case "price_desc": return priceB - priceA;
            case "name_asc": return a.name.localeCompare(b.name);
            case "name_desc": return b.name.localeCompare(a.name);
            default: return 0;
        }
    });
};

// Hàm xử lý sự kiện khi đổi select (chỉ sắp xếp, không lọc lại)
const handleSort = () => {
    applySort();
    renderProducts();
};

// ============================
// 🧩 HIỂN THỊ PHÂN TRANG
// ============================
const renderPagination = (totalItems) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const paginationContainer = document.querySelector('.pagination');

    if (totalPages <= 1) {
        paginationContainer.innerHTML = ''; // Ẩn nếu chỉ có 1 trang
        return;
    }

    let paginationHTML = `<button class="page-btn" onclick="changePage('prev')" ${currentPage === 1 ? 'disabled' : ''}>&lt;</button>`;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<span class="page-ellipsis">...</span>`;
        }
    }

    paginationHTML += `<button class="page-btn" onclick="changePage('next')" ${currentPage === totalPages ? 'disabled' : ''}>&gt;</button>`;
    paginationContainer.innerHTML = paginationHTML;
};

// ============================
// 🧩 HIỂN THỊ SẢN PHẨM
// ============================
const renderProducts = () => {
    const productGrid = document.querySelector('.products-grid');
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Hiển thị thông báo nếu không có sản phẩm
    if (paginatedProducts.length === 0) {
        productGrid.innerHTML = `<p class="no-products-found">No products found matching your criteria.</p>`;
    } else {
        let productsHTML = paginatedProducts.map(product => {

            // --- Logic tính giá (giữ nguyên của bạn) ---
            let priceHtml = product.discount_percentage != 0
                ? `<div class="product-price">
                   <span class="old-price">$${product.price}</span>
                   <span class="new-price">$${Math.round(product.price * (100 - product.discount_percentage) / 100)}</span>
               </div>`
                : `<div class="product-price">$${product.price}</div>`;

            // --- Logic MỚI: Định dạng số lượt bán ---
            // Thêm kiểm tra 'product.sales' tồn tại
            let salesDisplay = (product.sales && product.sales > 999)
                ? `${(product.sales / 1000).toFixed(1)}k+ sold`
                : `${product.sales || 0} sold`;

            // --- Logic MỚI: Định dạng rating ---
            // Thêm kiểm tra 'product.rating' tồn tại
            let ratingDisplay = `⭐️ ${product.rating ? product.rating.toFixed(1) : 'N/A'}`;

            // --- Trả về HTML đã cập nhật ---
            return `
            <div class="product-card flex-col flex-center">
                
                <div class="sales-badge">${salesDisplay}</div> 

                <button class="fav-btn" data-id="${product.id}" onclick="addToCart(${product.id})">
                    <img src="img/cart-icon.png" alt="Favorite">
                </button>
                <div class="product-info" onclick="location.href='detail.html?id=${product.id}'">
                    <div class="image">
                        <img src="img/products/${product.img}" alt="${product.name}">
                    </div>
                    <div class="product-title">${product.name}</div>
                    ${priceHtml}
                    
                    <div class="product-rating">${ratingDisplay}</div>

                </div>
                <button class="btn btn-buy btn-fill-black" onclick="handleBuyNow(${product.id})">Buy Now</button>
            </div>`;
        }).join("");

        productGrid.innerHTML = productsHTML;
    }

    renderPagination(filteredProducts.length);
    // Cập nhật số lượng sản phẩm
    document.querySelector('.selected-count b').textContent = filteredProducts.length;
};

// ============================
// ⚡ BẮT ĐẦU CHẠY
// ============================
document.addEventListener('DOMContentLoaded', initApp);