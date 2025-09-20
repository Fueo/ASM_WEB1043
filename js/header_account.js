let isShow = false;

const toggleUserBlock = () => {
    document.querySelectorAll(".user_block").forEach(user_block => {
        user_block.classList.toggle("show");
        document.querySelector(".arrow-account").innerHTML = isShow ? '&#129170;' : '&#129171;';
    })
    isShow = !isShow;

    checkLogin();
};

let isLoggedIn = false;

const checkLogin = () => {
    if (isLoggedIn) {
        document.querySelectorAll(".not_logged_in").forEach(block => {
            block.style = 'display:none'
        });
    }
    else {
        document.querySelectorAll(".logged_in").forEach(block => {
            block.style = 'display:none'
        });
    }
}