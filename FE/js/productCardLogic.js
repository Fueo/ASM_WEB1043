import { initializeProduct } from "./data/fetchData.js";


//Xử lý SK người dùng ấn nút Buy Now. Vừa addtocart vừa đổi sang trang cart.html
export const handleBuyNow = (productId) => {
    addToCart(productId);
    window.location.href = 'cart.html';
}

// Hàm xử lý logic thêm vào giỏ hàng. Sẽ được add vào onclick khi render giao diện product
export const addToCart = async (productId) => {
    console.log("Adding to cart:", productId);
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Lấy mảng cart từ local storage
    const product = await findProductById(productId); // tìm ra product theo id

    if (product) {
        const existingItem = cart.find(item => item.id === productId); // kiểm tra xem sp đã tồn tại trong cart chưa

        if (existingItem) {
            existingItem.quantity += 1; // nếu có rồi Số lượng +1
        } else {
            cart.push({ // không thì add mới
                id: product.id,
                name: product.name,
                price: Math.round(product.price * (100 - product.discount_percentage) / 100), // giá sau khi giảm
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
const findProductById = async (productId) => {
    const productData = await initializeProduct();
    // cú pháp duyệt theo các key của mảng VD "New Arrival", "BestSeller"
    const product = productData.find(p => p.id === productId); // tìm ra sản phẩm đầu tiên có id trùng với tham số id truyền vào
    if (product) {
        console.log(product)
        return product; // nếu tìm thấy thì return
    }

    return null; // ko thì trả về rỗng
};

