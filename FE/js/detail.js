import { initializeProduct } from "./data/fetchData.js";
import { addToCart, handleBuyNow } from "./productCardLogic.js";

// Đưa hàm ra global scope để HTML có thể gọi
window.addToCart = addToCart;
window.handleBuyNow = handleBuyNow;


/**
 * --------------------------------------
 * KHỞI TẠO TRANG
 * --------------------------------------
 */
document.addEventListener('DOMContentLoaded', () => {
    initDetailPage();
});

/**
 * Hàm chính khởi tạo trang
 */
const initDetailPage = async () => {
    // 1. Lấy ID sản phẩm từ URL
    const productId = getProductIdFromUrl();
    if (!productId) {
        document.querySelector('.detail-main').innerHTML = "<h1>Không tìm thấy sản phẩm.</h1>";
        return;
    }

    // 2. Fetch toàn bộ danh sách sản phẩm
    // (Giả sử file JSON nằm ở 'data/products.json')
    const allProducts = await initializeProduct();
    if (!allProducts || allProducts.length === 0) {
        document.querySelector('.detail-main').innerHTML = "<h1>Lỗi tải dữ liệu sản phẩm.</h1>";
        return;
    }

    // 3. Tìm sản phẩm hiện tại
    const product = allProducts.find(p => p.id === productId);
    if (!product) {
        document.querySelector('.detail-main').innerHTML = `<h1>Không tìm thấy sản phẩm với ID: ${productId}</h1>`;
        return;
    }

    // 4. Render thông tin chi tiết
    renderProductDetails(product);

    // 5. Render sản phẩm liên quan
    renderRelatedProducts(allProducts, product.category_id, product.id);

    // 6. Gắn sự kiện cho nút "Add to Cart" và "Buy Now"
    setupActionButtons(product);
};

/**
 * --------------------------------------
 * CÁC HÀM HỖ TRỢ
 * --------------------------------------
 */

/**
 * Lấy ID từ query parameter 'id' trên URL
 * @returns {number | null} - Trả về ID (dạng số) hoặc null
 */
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id ? parseInt(id) : null;
}

/**
 * Fetch danh sách sản phẩm từ file JSON
 * @returns {Promise<Array>} - Mảng sản phẩm
 */
async function fetchProducts() {

}

/**
 * Đổ dữ liệu sản phẩm vào HTML
 * @param {object} product - Đối tượng sản phẩm tìm được
 */
function renderProductDetails(product) {
    // 1. Cập nhật Breadcrumb
    document.querySelector('.breadcrumb span').textContent = product.name;

    // 2. Cập nhật ảnh chính
    const mainImage = document.querySelector('.main-image');
    mainImage.src = `img/products/${product.img}`;
    mainImage.alt = product.name;

    // 3. Cập nhật tên sản phẩm
    document.querySelector('.detail-content h1').textContent = product.name;

    // 4. Cập nhật giá
    const priceContainer = document.querySelector('.detail-content .price');
    if (product.discount_percentage > 0) {
        const newPrice = Math.round(product.price * (100 - product.discount_percentage) / 100);
        priceContainer.innerHTML = `
            <span class="current-price">$${newPrice}</span>
            <span class="original-price">$${product.price}</span>
        `;
    } else {
        priceContainer.innerHTML = `
            <span class="current-price">$${product.price}</span>
        `;
    }

    // 5. MỚI: Cập nhật Rating và Sales
    const statsContainer = document.querySelector('.detail-stats');
    if (statsContainer) {
        // Lấy logic định dạng
        let salesDisplay = (product.sales && product.sales > 999)
            ? `${(product.sales / 1000).toFixed(1)}k+ sold`
            : `${product.sales || 0} sold`;

        let ratingDisplay = `⭐️ ${product.rating ? product.rating.toFixed(1) : 'N/A'}`;

        // Điền HTML vào
        statsContainer.innerHTML = `
            <span class="detail-rating">${ratingDisplay}</span>
            <span class="detail-sales">${salesDisplay}</span>
        `;
    }
}

/**
 * Gắn sự kiện click cho các nút hành động
 * @param {object} product - Đối tượng sản phẩm
 */
function setupActionButtons(product) {
    const addBtn = document.querySelector('.btn-add');
    const buyBtn = document.querySelector('.btn-buynow');

    addBtn.addEventListener('click', () => {
        addToCart(product.id);
    });

    buyBtn.addEventListener('click', () => {
        handleBuyNow(product.id);
    });
}

/**
 * Render các sản phẩm liên quan (cùng category)
 * @param {Array} allProducts - Toàn bộ danh sách sản phẩm
 * @param {number} categoryId - ID category của sản phẩm hiện tại
 * @param {number} currentProductId - ID của sản phẩm hiện tại (để loại trừ)
 */
function renderRelatedProducts(allProducts, categoryId, currentProductId) {
    const container = document.getElementById('product-related');

    // Lọc sản phẩm cùng category, loại trừ chính nó
    const relatedProducts = allProducts.filter(p =>
        p.category_id === categoryId && p.id !== currentProductId
    );

    // Giới hạn 4 sản phẩm
    const productsToShow = relatedProducts.slice(0, 4);

    if (productsToShow.length === 0) {
        container.innerHTML = "<p>Không tìm thấy sản phẩm liên quan.</p>";
        return;
    }

    // Sử dụng hàm render card (giống trang products)
    container.innerHTML = productsToShow.map(product =>
        createProductCardHtml(product)
    ).join("");
}

/**
 * Tạo HTML cho một thẻ sản phẩm (dùng cho Related Products)
 * (Dựa trên code render của `products.js` ở các prompt trước)
 * @param {object} product - Đối tượng sản phẩm
 * @returns {string} - Chuỗi HTML
 */
function createProductCardHtml(product) {
    let priceHtml = product.discount_percentage != 0
        ? `<div class="product-price">
           <span class="old-price">$${product.price}</span>
           <span class="new-price">$${Math.round(product.price * (100 - product.discount_percentage) / 100)}</span>
       </div>`
        : `<div class="product-price">$${product.price}</div>`;

    let salesDisplay = (product.sales && product.sales > 999)
        ? `${(product.sales / 1000).toFixed(1)}k+ sold`
        : `${product.sales || 0} sold`;

    let ratingDisplay = `⭐️ ${product.rating ? product.rating.toFixed(1) : 'N/A'}`;

    // Quan trọng: Sửa 'location.href' để khi click nó tải trang chi tiết mới
    // Thêm class 'related-card' nếu bạn muốn style riêng
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
}