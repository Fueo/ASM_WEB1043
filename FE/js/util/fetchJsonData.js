export async function fetchJsonData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Lỗi HTTP: ${response.status} khi truy cập ${url}`)
        }
        return await response.json();
    } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error.message);
        return
    }
}