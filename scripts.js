// 1. Cấu hình Supabase (Đổi tên biến thành supabaseClient để tránh trùng với thư viện CDN)
const SUPABASE_URL = 'https://umaxbpkplohjcsckwddl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_b4qb5xuTjj3OsMWo8l3Lmw_Y87Gesu3';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Các biến quản lý trạng thái
const ITEMS_PER_PAGE = 8;
let stories = [];       // Dữ liệu gốc lấy từ Supabase
let filtered = [];      // Dữ liệu sau khi tìm kiếm
let displayedCount = 0;

const grid = document.getElementById("grid");
const search = document.getElementById("search");

// 2. IntersectionObserver hỗ trợ Infinite Scroll
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        observer.unobserve(entries[0].target);
        loadMore();
    }
}, { threshold: 0.1 });

// 3. Hàm tải dữ liệu từ Supabase Database
async function fetchStoriesFromSupabase() {
    try {
        const { data, error } = await supabaseClient
            .from('stories')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error("Lỗi lấy dữ liệu Supabase:", error.message);
            grid.innerHTML = '<div class="empty-state">Không thể tải dữ liệu!</div>';
            return;
        }

        stories = data || [];
        filtered = [...stories];
        
        grid.innerHTML = "";
        displayedCount = 0;
        loadMore();
    } catch (err) {
        console.error("Lỗi hệ thống:", err);
    }
}

// 4. Hàm hiển thị thêm sản phẩm khi cuộn trang
function loadMore() {
    const nextItems = filtered.slice(displayedCount, displayedCount + ITEMS_PER_PAGE);
    
    const oldSentinel = document.getElementById("sentinel");
    if (oldSentinel) oldSentinel.remove();

    renderItems(nextItems);
    displayedCount += ITEMS_PER_PAGE;

    if (displayedCount < filtered.length) {
        const sentinel = document.createElement("div");
        sentinel.id = "sentinel";
        grid.appendChild(sentinel);
        observer.observe(sentinel);
    }
}

// 5. Render thẻ Card
function renderItems(items) {
    if (items.length === 0 && displayedCount === 0) {
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
                        <a class="telegram btn" href="${link}" target="_blank" rel="noopener">
                            ${index === 0 ? '<span>Xem ảnh</span>' : '<span>Xem video</span>'}
                        </a>`).join("")
                    : `<a class="telegram btn" href="${teleLinks[0]}" target="_blank" rel="noopener"><span>Xem</span></a>`
                }
            </div>
        `;
        grid.appendChild(card);
    });
}

// 6. Xử lý sự kiện tìm kiếm
search.addEventListener("input", () => {
    const keyword = search.value.toLowerCase().trim();
    filtered = stories.filter(story => 
        (story.title && story.title.toLowerCase().includes(keyword))
    );
    
    grid.innerHTML = "";
    displayedCount = 0;
    loadMore(); 
});

// 7. Xử lý chuyển hướng quảng cáo khi click button
document.addEventListener("click", function (e) {
    const btn = e.target.closest(".btn");
    if (!btn) return;

    e.preventDefault();

    const telegramUrl = btn.href;
    const shopeeUrl = "https://s.shopee.vn/10y6YHWxqs";

    window.open(shopeeUrl, "_blank");
    window.location.href = telegramUrl;
});

// 8. Khởi chạy ứng dụng
fetchStoriesFromSupabase();
