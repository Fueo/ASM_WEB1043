
const productData = {
    "New Arrival": [
        { img: "iphone.png", name: "iPhone 14 Pro 128GB", price: 999, id: "new-arrival-1" },
        { img: "ipad.png", name: 'Apple iPad 9 10.2" 64GB Wi-Fi', price: 398, id: "new-arrival-2" },
        { img: "watch.png", name: "Apple Watch Series 8 GPS 45mm", price: 399, id: "new-arrival-3" },
        { img: "watch.png", name: "Apple Watch Series 8 GPS 45mm", price: 399, id: "new-arrival-4" },
        { img: "iphone.png", name: "iPhone 14 Pro 128GB", price: 999, id: "new-arrival-1" },
        { img: "ipad.png", name: 'Apple iPad 9 10.2" 64GB Wi-Fi', price: 398, id: "new-arrival-2" },
        { img: "watch.png", name: "Apple Watch Series 8 GPS 45mm", price: 399, id: "new-arrival-3" },
        { img: "watch.png", name: "Apple Watch Series 8 GPS 45mm", price: 399, id: "new-arrival-4" },
        { img: "iphone.png", name: "iPhone 14 Pro 128GB", price: 999, id: "new-arrival-1" },
        { img: "ipad.png", name: 'Apple iPad 9 10.2" 64GB Wi-Fi', price: 398, id: "new-arrival-2" },
        { img: "watch.png", name: "Apple Watch Series 8 GPS 45mm", price: 399, id: "new-arrival-3" },
        { img: "watch.png", name: "Apple Watch Series 8 GPS 45mm", price: 399, id: "new-arrival-4" },
    ],

    "Bestseller": [
        { img: "iphone1.png", name: "iPhone 14 Pro 256GB", price: 1099, id: "bestseller-1" },
        { img: "iphone2.png", name: "iPhone 14 Pro Max 128GB", price: 1199, id: "bestseller-2" },
        { img: "airpod.png", name: "Apple AirPods Pro (2nd Gen)", price: 249, id: "bestseller-3" },
        { img: "airpod.png", name: "Apple AirPods Pro (2nd Gen)", price: 249, id: "bestseller-4" },
    ],

    "Featured Products": [
        { img: "camera.png", name: "Canon EOS R5 Mirrorless Camera", price: 3899, id: "featured-1" },
        { img: "headphones.png", name: "Apple AirPods Max", price: 549, id: "featured-2" },
        { img: "samsungwatch.png", name: "Samsung Galaxy Watch 5 44mm", price: 329, id: "featured-3" },
        { img: "galaxyz.png", name: "Samsung Galaxy S22 Ultra 256GB", price: 1199, id: "featured-4" }
    ],

    "Discount": [
        { img: "iphone3.png", name: "iPhone 14 Pro Max 256GB", price: 1299, oldPrice: 1399, id: "discount-1" },
        { img: "iphone4.png", name: "iPhone 13 128GB", price: 749, oldPrice: 799, id: "discount-2" },
        { img: "iphone5.png", name: "iPhone 13 Mini 128GB", price: 649, oldPrice: 699, id: "discount-3" },
        { img: "iphone6.png", name: "iPhone 12 128GB", price: 549, oldPrice: 599, id: "discount-4" }
    ],

    "Related": [
        { img: "iphone3.png", name: "iPhone 14 Pro Max 256GB", price: 1299, oldPrice: 1399, id: "related-1" },
        { img: "iphone4.png", name: "iPhone 13 128GB", price: 749, oldPrice: 799, id: "related-2" },
        { img: "iphone5.png", name: "iPhone 13 Mini 128GB", price: 649, oldPrice: 699, id: "related-3" },
        { img: "iphone6.png", name: "iPhone 12 128GB", price: 549, oldPrice: 599, id: "related-4" }
    ]
};

// Function to add item to cart
const addToCart = (productId) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = findProductById(productId);

    if (product) {
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.img,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} added to cart!`);
        updateCartDisplay();
    } else {
        alert('Product not found!');
    }
};

// Function to find a product by its ID
const findProductById = (productId) => {
    for (const tab in productData) {
        const product = productData[tab].find(p => p.id === productId);
        if (product) {
            return product;
        }
    }
    return null;
};

// Pagination settings
const ITEMS_PER_PAGE = 6;
let currentPage = 1;


//Tính toán và hiển thị các nút chuyển trang
const renderPagination = (totalItems) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);  // Tính toán số trang cao nhất có được bằng cách chia rồi làm tròn lên
    // VD mảng có 19 item => 19 / 6 = 3.16 => totalPage = 4
    const paginationContainer = document.querySelector('.pagination');

    let paginationHTML = `
        <button class="page-btn" onclick="changePage('prev')">&lt;</button>
    `;
    //Khởi tạo nội dung html với giá trị ban đầu là nút Prev => Giao diện hiển thị sẽ có dạng: <
    //Duyệt các nút phân trang
    for (let i = 1; i <= totalPages; i++) {
        // Câu lệnh kiểm tra ở dưới có nghĩa là: 
        // Chỉ hiển thị nút để tới trang đầu tiên, các trang liền kề currentPage và trang cuối.
        // VD currentPage = 2 => Giao diện hiển thị sẽ có dạng: 1 2 3 ... 5
        // VD currentPage = 5 => Giao diện hiển thị sẽ có dạng: 1 ... 4 5 
        // VD currentPage = 4 => Giao diện hiển thị sẽ có dạng: 1 .. 3 4 5 
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <button class="page-btn ${i === currentPage ? 'active' : ''}" 
                        onclick="changePage(${i})">${i}</button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<span class="page-ellipsis">...</span>`;
        }
    }

    paginationHTML += `
        <button class="page-btn" onclick="changePage('next')">&gt;</button>
    `;
    // Add nút Next vào cuối giao diệ => Giao diện hiển thị sẽ có dạng: < 1 2 3 ... 5 >

    paginationContainer.innerHTML = paginationHTML;
};


// Logic chuyển trang
const changePage = (page) => {
    const allProducts = Object.values(productData).flat(); // Làm nông tất cả các item trong mảng productData.
    //Nếu bth các item đc chia theo các Key như "New Arrival", "BestSeller" thì hàm này sẽ trả về mảng productData với tất cả item đc xếp chung 1 bậc
    const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);

    if (page === 'prev') {
        currentPage = Math.max(1, currentPage - 1); // KT nếu trang hiện tại là 1 thì ko giảm nữa
    } else if (page === 'next') {
        currentPage = Math.min(totalPages, currentPage + 1); // KT nếu trang hiện tại là trang cuối thì ko tăng nữa
    } else {
        currentPage = page; // Trường hợp còn lại thì bth
    }

    renderProducts(); // Render giao diện
};



const renderProducts = () => {
    const productGrid = document.querySelector('.products-grid');

    // Gộp toàn bộ sản phẩm từ các tab thành 1 bậc duy nhất.
    const allProducts = Object.values(productData).flat();

    // Tính toán chỉ số phân trang
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE; // VD ta có currentPage = 2, ITEMS_PER_PAGE = 6 => startIndex = (2 - 1) * 6 = 6;
    const endIndex = startIndex + ITEMS_PER_PAGE; // VD ta có startIndex = 6, ITEMS_PER_PAGE = 6 => endIndex = 6 + 6 = 12;
    const paginatedProducts = allProducts.slice(startIndex, endIndex);
    // Chỉ lấy các item có trong mảng có vị trí index trong khoảng từ startIndex đến endIndex để hiển thị lên giao diện

    // Sinh HTML cho từng sản phẩm
    const productsHTML = paginatedProducts.map(product => {
        let priceHtml = product.oldPrice
            ? `<div class="product-price">
                   <span class="old-price">$${product.oldPrice}</span>
                   <span class="new-price">$${product.price}</span>
               </div>`
            : `<div class="product-price">$${product.price}</div>`;

        return `
            <div class="product-card flex-col flex-center">
                <button class="fav-btn" onclick="addToCart('${product.id}')">
                    <img src="img/cart-icon.png" alt="Cart">
                </button>
                <div class="product-info" onclick="location.href='detail.html'">
                    <div class="image">
                        <img src="img/products/${product.img}" alt="${product.name}">
                    </div>
                    <div class="product-title">${product.name}</div>
                </div>
                ${priceHtml}
                <button class="btn btn-fill-black btn-buy" onclick="handleBuyNow('${product.id}')">Buy Now</button>
            </div>
        `;
    }).join('');

    // Gắn HTML vào grid
    productGrid.innerHTML = productsHTML;

    // Render lại giao diện các nút chuyển trang.
    renderPagination(allProducts.length);

    // Update số lượng sản phẩm
    document.querySelector('.selected-count b').textContent = allProducts.length;
};

// Xử lý nút buy now
const handleBuyNow = (productId) => {
    addToCart(productId);
    window.location.href = 'cart.html';
}

// Initialize products when DOM is loaded
document.addEventListener('DOMContentLoaded', renderProducts);
