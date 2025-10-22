document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    // ✅ Kiểm tra dữ liệu hợp lệ
    if (!name || !email || !password || !confirmPassword) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    if (password.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }

    if (password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
    }

    // ✅ Gửi yêu cầu POST đến server
    try {
        const newAccount = { email, password, role: 2 }; // role: 2 = user

        const res = await fetch('http://localhost:3000/api/add-account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAccount),
        });

        const data = await res.json();

        if (res.ok && data.success) {
            alert('🎉 Đăng ký thành công! Bạn có thể đăng nhập ngay.');
            console.log('Tài khoản mới:', data.data);
            window.location.href = 'login.html'; // Chuyển sang trang đăng nhập
        } else {
            alert(data.message || 'Đăng ký thất bại.');
        }
    } catch (err) {
        console.error('❌ Lỗi khi gửi yêu cầu:', err);
        alert('Không thể kết nối đến server.');
    }
});
