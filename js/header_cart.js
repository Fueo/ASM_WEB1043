let cartArr = ['hello', '111'];
const checkCart = () => {
    if (cartArr.length === 0) {
        document.querySelectorAll(".badge").forEach(badge => {
            badge.style = 'display:none'
        });
    }
    else {
        document.querySelectorAll(".badge").forEach(badge => {
            badge.style = 'display:flex';
            badge.innerHTML = cartArr.length;
        });
    }
}

checkCart();