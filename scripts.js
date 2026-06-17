const stories = [
{
title: "Hoa Sơn Tái Khởi",
image: "images/1.jpg",
telegram: "https://t.me/group1"
},
{
title: "Người Xấu",
image: "images/2.jpg",
telegram: "https://t.me/group2"
},
// thêm đến 100 truyện
];

const ITEMS_PER_PAGE = 24;

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

items.forEach(item=>{

    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
        <img loading="lazy"
             src="${item.image}"
             alt="${item.title}">
        <div class="info">
            <div class="title">${item.title}</div>
            <a class="telegram"
               href="${item.telegram}"
               target="_blank">
               Telegram
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
