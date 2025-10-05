const productData = {
    "New Arrival": [
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

// Hàm xử lý logic thêm vào giỏ hàng. Sẽ được add vào onclick khi render giao diện product
const addToCart = (productId) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Lấy mảng cart từ local storage
    const product = findProductById(productId); // tìm ra product theo id

    if (product) {
        const existingItem = cart.find(item => item.id === productId); // kiểm tra xem sp đã tồn tại trong cart chưa

        if (existingItem) {
            existingItem.quantity += 1; // nếu có rồi Số lượng +1
        } else {
            cart.push({ // không thì add mới
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.img,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart)); // cập nhật lại giỏ hàng trg local storage
        updateCartDisplay();  // hàm cập nhật lại cart badge trong header trong file header.js
    } else {
        alert('Product not found!');
    }
};

// Tìm sản phẩm theo ID lần lượt theo các key của mảng productData ở trên
const findProductById = (productId) => {
    for (const tab in productData) { // cú pháp duyệt theo các key của mảng VD "New Arrival", "BestSeller"
        const product = productData[tab].find(p => p.id === productId); // tìm ra sản phẩm đầu tiên có id trùng với tham số id truyền vào
        if (product) {
            return product; // nếu tìm thấy thì return
        }
    }
    return null; // ko thì trả về rỗng
};

// Render sản phẩm theo tên tab và append vào ID HTML
const renderProductsByTab = (tabName, id) => {
    let products = productData[tabName] || []; //Lấy dssp theo tabName hoặc có thể gọi là Key. VD: productData["New Arrival"]

    let htmlData = products.map(product => {
        let priceHtml = product.oldPrice
            ? `<div class="product-price">
                   <span class="old-price">$${product.oldPrice}</span>
                   <span class="new-price">$${product.price}</span>
               </div>`
            : `<div class="product-price">$${product.price}</div>`;

        return `                
            <div class="product-card flex-col flex-center">
                <button class="fav-btn" onclick="addToCart('${product.id}')">
                    <img src="img/cart-icon.png" alt="Favorite">
                </button>
                <div class="product-info" onclick="location.href='detail.html'">
                    <div class="image">
                        <img src="img/products/${product.img}" alt="${product.name}">
                    </div>
                    <div class="product-title">${product.name}</div>
                    ${priceHtml}
                </div>
                <button class="btn btn-buy btn-fill-black" onclick="handleBuyNow('${product.id}')">Buy Now</button>
            </div>`;
    }).join("");

    let productContainer = document.querySelector(`#${id}`); // Query container html chứa sp
    if (productContainer) { // Nếu query đc thì mới add.
        productContainer.innerHTML = htmlData;
    }
};

//Xử lý SK người dùng ấn nút Buy Now. Vừa addtocart vừa đổi sang trang cart.html
const handleBuyNow = (productId) => {
    addToCart(productId);
    window.location.href = 'cart.html';
}

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
    //Dành cho trang index.html
    AddEventToTabItem();
    renderProductsByTab("New Arrival", "product-tab");
    renderProductsByTab("Discount", "product-discount");

    //Dành cho trang detail.html
    renderProductsByTab("Related", "product-related")
}