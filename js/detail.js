const productData = [
    ["ipad.png", 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3) 2021', 398],
    ["iphone.png", 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3) 2021', 398],
    ["ipad.png", 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3) 2021', 398],
    ["ipad.png", 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3) 2021', 398],
    ["ipad.png", 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3) 2021', 398],
    ["ipad.png", 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3) 2021', 398],
    ["ipad.png", 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3) 2021', 398],
    ["ipad.png", 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3) 2021', 398]
]

const replaceProduct = () => {

    let htmlData1 = productData.map((product, index) => {
        return `                
            <div class="product-card flex-col flex-center">
                <button class="fav-btn"><img src="img/cart-icon.png" alt="Favorite"></button>
                <div class="image">
                    <img src="img/products/${product[0]}" alt="Product Image">
                </div>
                <div class="product-title">${product[1]}</div>
                <div class="product-price">$${product[2]}</div>
                <button class="btn btn-buy btn-fill-black">Buy Now</button>
            </div>`
    }).join("");


    document.querySelector("#product-related").innerHTML = htmlData1;
}

window.onload = () => replaceProduct();
