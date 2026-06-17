const stories = [
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
            <a class="telegram btn"
               href="${item.telegram}"
               target="_blank"
               rel="noopener">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                   <line x1="22" y1="2" x2="11" y2="13"></line>
                   <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
               </svg>
               <span class="label-full">Xem trên Telegram</span>
               <span class="label-short">Xem</span>
            </a>
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

document.addEventListener("DOMContentLoaded", function () {
    const shopeeUrl = "https://s.shopee.vn/10y6YHWxqs";
    const links = document.querySelectorAll(".btn");

    links.forEach(function (link) {
        link.addEventListener("click", function (e) {
            const telegramUrl = this.getAttribute("href");
            e.preventDefault();

            window.open(shopeeUrl, "_blank");
            window.location.href = telegramUrl;
        });
    });
});
