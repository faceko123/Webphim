// 1. Cấu hình Supabase Client
const SUPABASE_URL = 'https://umaxbpkplohjcsckwddl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_b4qb5xuTjj3OsMWo8l3Lmw_Y87Gesu3';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Các biến quản lý trạng thái
const ITEMS_PER_PAGE = 12;
let page = 0;
let hasMore = true;
let isLoading = false;
let currentSearchKeyword = "";

const grid = document.getElementById("grid");
const search = document.getElementById("search");

// 2. IntersectionObserver hỗ trợ Infinite Scroll khi cuộn tới cuối trang
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMore && !isLoading) {
        loadMoreStories();
    }
}, { threshold: 0.1 });

// 3. Hàm tải dữ liệu phân trang trực tiếp từ Supabase
async function loadMoreStories() {
    if (isLoading || !hasMore) return;
    isLoading = true;

    // Xóa phần tử cuộn cũ (sentinel) nếu có
    const oldSentinel = document.getElementById("sentinel");
    if (oldSentinel) oldSentinel.remove();

    const from = page * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    try {
        let query = supabaseClient
            .from('stories')
            .select('*')
            .order('click_count', { ascending: false }) // Nhiều lượt bấm nhất lên đầu
            .order('id', { ascending: true })           // Bằng nhau (kể cả chưa có lượt) -> theo ID tăng dần
            .range(from, to);

        // Lọc từ Server nếu người dùng có nhập từ khóa tìm kiếm
        if (currentSearchKeyword) {
            query = query.ilike('title', `%${currentSearchKeyword}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Lỗi lấy dữ liệu:", error.message);
            if (page === 0) {
                grid.innerHTML = '<div class="empty-state">Không thể tải dữ liệu!</div>';
            }
            return;
        }

        if (!data || data.length < ITEMS_PER_PAGE) {
            hasMore = false; // Đã hết dữ liệu trong Database
        }

        renderItems(data);
        page++;

        // Tạo phần tử theo dõi cuộn trang nếu vẫn còn dữ liệu
        if (hasMore) {
            const sentinel = document.createElement("div");
            sentinel.id = "sentinel";
            grid.appendChild(sentinel);
            observer.observe(sentinel);
        }
    } catch (err) {
        console.error("Lỗi hệ thống:", err);
    } finally {
        isLoading = false;
    }
}

// 4. Render thẻ Card
function renderItems(items) {
    if (items.length === 0 && page === 0) {
        grid.innerHTML = '<div class="empty-state">Không tìm thấy nội dung phù hợp!</div>';
        return;
    }

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";

        // Xử lý dữ liệu telegram (chuyển sang mảng nếu cần)
        const teleLinks = Array.isArray(item.telegram) ? item.telegram : [item.telegram];

        card.innerHTML = `
            <img loading="lazy" src="${item.image}" alt="${item.title || 'Video'}">
            <div class="page-edge"></div>
            <div class="info">
                <div class="title">${item.title || 'Không có tiêu đề'}</div>
                ${teleLinks.length > 1
                    ? teleLinks.map((link, index) => `
                        <a class="telegram btn" data-id="${item.id}" href="${link}" target="_blank" rel="noopener">
                            ${index === 0 ? '<span>Xem ảnh</span>' : '<span>Xem video</span>'}
                        </a>`).join("")
                    : `<a class="telegram btn" data-id="${item.id}" href="${teleLinks[0]}" target="_blank" rel="noopener"><span>Xem</span></a>`
                }
            </div>
        `;
        grid.appendChild(card);
    });
}

// 5. Xử lý sự kiện tìm kiếm (Debounce nhẹ để tránh gửi query liên tục)
let searchTimeout;
search.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        currentSearchKeyword = search.value.trim();

        // Reset trạng thái về trang đầu tiên
        grid.innerHTML = "";
        page = 0;
        hasMore = true;
        isLoading = false;

        loadMoreStories();
    }, 300); // Chờ 300ms sau khi ngừng gõ mới gửi yêu cầu
});

// 6. Ghi nhận lượt bấm.
//    Dùng fetch + keepalive để request vẫn được gửi đi dù trang sắp chuyển sang Telegram.
function trackClick(storyId) {
    if (!storyId) return;
    try {
        fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_click`, {
            method: "POST",
            keepalive: true,
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ story_id: Number(storyId) })
        }).catch(() => { });
    } catch (err) {
        console.error("Lỗi ghi nhận lượt bấm:", err);
    }
}

// 7. Xử lý chuyển hướng quảng cáo khi click button
document.addEventListener("click", function (e) {
    const btn = e.target.closest(".btn");
    if (!btn) return;

    e.preventDefault();

    trackClick(btn.dataset.id);

    const telegramUrl = btn.href;
    const shopeeUrl = "https://s.shopee.vn/10y6YHWxqs";

    window.open(shopeeUrl, "_blank");
    window.location.href = telegramUrl;
});

// 8. Khởi chạy ứng dụng
loadMoreStories();
