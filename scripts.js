const stories = [
{
title: "SWEE904",
image: "images/yee_rim.jpg",
telegram: "https://t.me/swee904x"
},
{
title: "Yumi_03",
image: "images/yumi_03.webp",
telegram: [
    "https://t.me/+lKumIRQ2mI04NmI1",
    "https://t.me/+hKUWeNp8laczNjFl",
]
},
{
title: "aryminh",
image: "images/aryminh.jpg",
telegram: [
    "https://t.me/+di26JmXczwY0MTFl",
    "https://t.me/+8spGY0vSHtgwOGE1",
]
},
{
title: "Yoon gong-ju",
image: "images/yoongongju.jpg",
telegram: "https://t.me/+QhGi3rU_28VmNzg9"
},
{
title: "Yoon gong-ju",
image: "images/meriol.jpg",
telegram: "https://t.me/+6pFpitdxNww2ZDU1"
},
{
title: "SNOS-139",
image: "images/1.jpg",
telegram: "https://t.me/+S7uFgXY4HxUwZjk1"
},
{
title: "SONE-798",
image: "images/2.jpg",
telegram: "https://t.me/+u1leGvRIE9dhYzJl"
},
{
title: "MIDV-699",
image: "images/3.jpg",
telegram: "https://t.me/+Jfgh2HAbRws2MTI1"
},
{
title: "MIDA-649",
image: "images/4.jpg",
telegram: "https://t.me/+4J5Y6PhNPMdkOWE1"
},
{
title: "MIMK-187",
image: "images/5.jpg",
telegram: "https://tktube.com/vi/videos/302991/mimk-187c-u-1-1-2-43-000-s/"
},
];

const ITEMS_PER_PAGE = 8;
let filtered = [...stories];
let displayedCount = 0;

const grid = document.getElementById("grid");
const search = document.getElementById("search");

// Tạo Observer bên ngoài để tái sử dụng
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        observer.unobserve(entries[0].target); // Ngừng quan sát cái cũ
        loadMore();
    }
}, { threshold: 0.1 });

function loadMore() {
    // Chỉ lấy phần tử tiếp theo chưa hiển thị
    const nextItems = filtered.slice(displayedCount, displayedCount + ITEMS_PER_PAGE);
    
    // Xóa thẻ sentinel cũ nếu có
    const oldSentinel = document.getElementById("sentinel");
    if (oldSentinel) oldSentinel.remove();

    // Thêm các item mới vào mà không xóa item cũ
    renderItems(nextItems);
    
    displayedCount += ITEMS_PER_PAGE;

    // Nếu vẫn còn dữ liệu, thêm lại sentinel vào cuối
    if (displayedCount < filtered.length) {
        const sentinel = document.createElement("div");
        sentinel.id = "sentinel";
        grid.appendChild(sentinel);
        observer.observe(sentinel);
    }
}

function renderItems(items) {
    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img loading="lazy" src="${item.image}" alt="${item.title}">
            <div class="page-edge"></div>
            <div class="info">
                <div class="title">${item.title}</div>
                ${Array.isArray(item.telegram)
                    ? item.telegram.map((link, index) => `
                        <a class="telegram btn" href="${link}" target="_blank" rel="noopener">
                            ${index === 0 ? '<span>Xem ảnh</span>' : '<span>Xem video</span>'}
                        </a>`).join("")
                    : `<a class="telegram btn" href="${item.telegram}" target="_blank" rel="noopener"><span>Xem</span></a>`
                }
            </div>
        `;
        grid.appendChild(card);
    });
}

// Xử lý tìm kiếm (cần xóa sạch và render lại từ đầu)
search.addEventListener("input", () => {
    const keyword = search.value.toLowerCase();
    filtered = stories.filter(story => story.title.toLowerCase().includes(keyword));
    
    grid.innerHTML = ""; // Chỉ xóa ở đây khi tìm kiếm
    displayedCount = 0;
    loadMore(); 
});

// Chạy lần đầu
loadMore();
