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

// Render sản phẩm theo tên tab và append vào ID HTML
const renderProductsByTab = (tabName, id) => {
    let products = productData[tabName] || [];

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

    document.querySelector(`#${id}`).innerHTML = htmlData;
};

const handleBuyNow = (productId) => {
    addToCart(productId);
    window.location.href = 'cart.html';
}

// Add event listener cho tab
const AddEventToTabItem = () => {
    document.querySelectorAll(".tab-item").forEach(tab => {
        tab.addEventListener("click", function () {
            document.querySelectorAll(".tab-item").forEach(t => t.classList.remove("active"));
            this.classList.add("active");

            const tabName = this.innerHTML;
            renderProductsByTab(tabName, "product-tab");
        })
    })
}

// Khởi động khi load trang
window.onload = () => {
    AddEventToTabItem();
    renderProductsByTab("New Arrival", "product-related");
}