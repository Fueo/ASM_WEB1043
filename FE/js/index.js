import { initializeIndex } from "./data/fetchData.js";
import { addToCart, handleBuyNow } from "./productCardLogic.js";
let productData = {};

// Hàm khởi tạo ứng dụng
const initApp = async () => {

    window.addToCart = addToCart;
    window.handleBuyNow = handleBuyNow;
    productData = await initializeIndex();
    AddEventToTabItem();

    //Dành cho trang index.html
    renderProductsByTab("New Arrival", "product-tab");
    renderProductsByTab("Discount", "product-discount");

    //Dành cho trang detail.html
    renderProductsByTab("Related", "product-related")

}

// Render sản phẩm theo tên tab và append vào ID HTML
const renderProductsByTab = (tabName, id) => {
    let products = productData[tabName] || []; //Lấy dssp theo tabName hoặc có thể gọi là Key. VD: productData["New Arrival"]

    let htmlData = products.map(product => {

        // --- Logic tính giá (giữ nguyên của bạn) ---
        let priceHtml = product.discount_percentage != 0
            ? `<div class="product-price">
               <span class="old-price">$${product.price}</span>
               <span class="new-price">$${Math.round(product.price * (100 - product.discount_percentage) / 100)}</span>
           </div>`
            : `<div class="product-price">$${product.price}</div>`;

        // --- Logic MỚI: Định dạng số lượt bán ---
        let salesDisplay = product.sales > 999
            ? `${(product.sales / 1000).toFixed(1)}k+ sold`
            : `${product.sales} sold`;

        // --- Logic MỚI: Định dạng rating ---
        // Giả sử product.rating là một số, ví dụ: 4.7
        let ratingDisplay = `⭐️ ${product.rating.toFixed(1)}`;

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

    let productContainer = document.querySelector(`#${id}`); // Query container html chứa sp
    if (productContainer) { // Nếu query đc thì mới add.
        productContainer.innerHTML = htmlData;
    }
};



// Hàm thêm sự kiện xử lý logic cho các nút tab
const AddEventToTabItem = () => {
    //Query tất cả các nút tab ở index.html
    document.querySelectorAll(".tab-item").forEach(tab => {
        // Thêm xử lý sk click cho các tab item
        tab.addEventListener("click", function () {
            document.querySelectorAll(".tab-item").forEach(t => t.classList.remove("active")); // Xóa tất cả class active của các tab-item
            this.classList.add("active"); // add lại class active cho item đang được chọn

            const tabName = this.innerHTML; // Lấy nội dung của tab đó vd <button>New Arrival</button> => tabName = New Arrival
            renderProductsByTab(tabName, "product-tab"); // Render lại giao diện theo tabName
        })
    })
}

// Khởi động khi load trang
window.onload = () => {
    // Khởi tạo dữ liệu trang index
    initApp();

}

