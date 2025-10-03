const updateCartDisplay = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.length;

    document.querySelectorAll(".badge").forEach(badge => {
        if (cartCount === 0) {
            badge.style.display = 'none';
        } else {
            badge.style.display = 'flex';
            badge.innerHTML = cartCount;
        }
    });
};

// Call updateCartDisplay on page load
updateCartDisplay();

// Listen for changes to localStorage (in case the cart is updated from another page)
window.addEventListener('storage', function (event) {
    if (event.key === 'cart') {
        updateCartDisplay();
    }
});