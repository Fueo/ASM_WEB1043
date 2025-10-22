document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Ngăn reload trang

        // Lấy dữ liệu từ input
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            alert('Vui lòng nhập email và mật khẩu!');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                alert('🎉 Đăng nhập thành công!');
                // Lưu thông tin user vào localStorage
                localStorage.setItem('user', JSON.stringify(data.user));

                // Chuyển sang trang chủ (hoặc dashboard)
                window.location.href = 'index.html';
            } else {
                alert(data.message || 'Đăng nhập thất bại.');
            }
        } catch (error) {
            console.error('❌ Lỗi đăng nhập:', error);
            alert('Không thể kết nối đến server.');
        }
    });
});
