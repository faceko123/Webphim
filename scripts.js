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
let currentPage = 1;

const grid = document.getElementById("grid");
const pagination = document.getElementById("pagination");
const search = document.getElementById("search");

function renderPage(page){


currentPage = page;

const start = (page - 1) * ITEMS_PER_PAGE;
const end = start + ITEMS_PER_PAGE;

const items = filtered.slice(start,end);

grid.innerHTML = "";

if(items.length === 0){

    const empty = document.createElement("div");

    empty.className = "empty-state";

    empty.innerHTML = search.value
        ? `Không tìm thấy video nào khớp với “<strong>${search.value}</strong>”`
        : `Chưa có video nào trong thư viện.`;

    grid.appendChild(empty);

    renderPagination();

    return;
}

items.forEach(item=>{

    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
        <img loading="lazy"
             src="${item.image}"
             alt="${item.title}">
        <div class="page-edge"></div>
        <div class="info">
            <div class="title">${item.title}</div>

            ${
                Array.isArray(item.telegram)
                ? item.telegram.map((link, index) => `
                    <a class="telegram btn"
                        href="${link}"
                        target="_blank"
                        rel="noopener">
                        ${index === 0
                            ? '<span>Xem ảnh</span>'
                            : '<span>Xem video</span>'
                        }
                    </a>
                `).join("")
                : `
                <a class="telegram btn"
                    href="${item.telegram}"
                    target="_blank"
                    rel="noopener">
                    <span>Xem</span>
                </a>
                `
            }
        </div>  
    `;

    grid.appendChild(card);
});

renderPagination();


}

function renderPagination(){


pagination.innerHTML = "";

const totalPages =
    Math.ceil(filtered.length / ITEMS_PER_PAGE);

for(let i=1;i<=totalPages;i++){

    const btn = document.createElement("button");

    btn.textContent = i;

    if(i === currentPage){
        btn.classList.add("active");
    }

    btn.onclick = ()=>renderPage(i);

    pagination.appendChild(btn);
}


}

search.addEventListener("input",()=>{

const keyword =
    search.value.toLowerCase();

filtered = stories.filter(story =>
    story.title.toLowerCase()
    .includes(keyword)
);

renderPage(1);

});

renderPage(1);

document.addEventListener("click", function (e) {
    const btn = e.target.closest(".btn");
    if (!btn) return;

    e.preventDefault();

    const telegramUrl = btn.href;
    const shopeeUrl = "https://s.shopee.vn/10y6YHWxqs";

    window.open(shopeeUrl, "_blank");
    window.location.href = telegramUrl;
});
