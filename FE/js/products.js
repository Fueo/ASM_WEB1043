import { initializeCategories, initializeProduct } from "./data/fetchData.js";
import { addToCart, handleBuyNow } from "./productCardLogic.js";

let categories = [];
let productData = [];
let filteredProducts = [];
const ITEMS_PER_PAGE = 6;
let currentPage = 1;

const initApp = async () => {
    productData = await initializeProduct();
    categories = await initializeCategories();
    filteredProducts = productData; // mặc định hiển thị tất cả

    document.querySelector('.sort-select').addEventListener('change', handleSort);
    renderCategoryList();
    renderProducts();


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
        checkbox.addEventListener('change', handleCategoryFilter);
    });
};

// ============================
// 🧩 XỬ LÝ LỌC CATEGORY
// ============================
const handleCategoryFilter = () => {
    const checkedBoxes = document.querySelectorAll('.sidebar-list input[type="checkbox"]:checked');
    const selectedIds = [...checkedBoxes].map(cb => parseInt(cb.dataset.id));

    if (selectedIds.length === 0) {
        filteredProducts = productData; // không chọn gì => hiển thị tất cả
    } else {
        filteredProducts = productData.filter(p => selectedIds.includes(p.category_id));
    }

    currentPage = 1; // quay lại trang 1
    renderProducts();
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
// 🧩 SẮP XẾP SẢN PHẨM
// ============================
const handleSort = (event) => {
    const sortValue = event.target.value;

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

    renderProducts();
};



const renderPagination = (totalItems) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const paginationContainer = document.querySelector('.pagination');

    let paginationHTML = `<button class="page-btn" onclick="changePage('prev')">&lt;</button>`;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<span class="page-ellipsis">...</span>`;
        }
    }

    paginationHTML += `<button class="page-btn" onclick="changePage('next')">&gt;</button>`;
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

    let productsHTML = paginatedProducts.map(product => {
        let priceHtml = product.discount_percentage != 0
            ? `<div class="product-price">
                   <span class="old-price">$${product.price}</span>
                   <span class="new-price">$${Math.round(product.price * (100 - product.discount_percentage) / 100)}</span>
               </div>`
            : `<div class="product-price">$${product.price}</div>`;

        return `                
            <div class="product-card flex-col flex-center">
                <button class="fav-btn" data-id="${product.id}" onclick="addToCart(${product.id})">
                    <img src="img/cart-icon.png" alt="Favorite">
                </button>
                <div class="product-info" onclick="location.href='detail.html'">
                    <div class="image">
                        <img src="img/products/${product.img}" alt="${product.name}">
                    </div>
                    <div class="product-title">${product.name}</div>
                    ${priceHtml}
                </div>
                <button class="btn btn-buy btn-fill-black" onclick="handleBuyNow(${product.id})">Buy Now</button>
            </div>`;
    }).join("");

    productGrid.innerHTML = productsHTML;

    renderPagination(filteredProducts.length);
    document.querySelector('.selected-count b').textContent = filteredProducts.length;
};

// ============================
// ⚡ KHỞI TẠO
// ============================
document.addEventListener('DOMContentLoaded', initApp);
