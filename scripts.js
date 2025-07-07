function showSection(id) {
    // Dừng tất cả video khi chuyển section
    document.querySelectorAll("video").forEach(video => {
        video.pause();
        video.currentTime = 0;
    });

    // Ẩn tất cả section
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Ẩn menu chính nếu không quay lại
    if (id !== "mainMenu") {
        document.getElementById("mainMenu").style.display = "none";
    }

    // Hiện section được chọn
    const section = document.getElementById(id);
    if (section) section.classList.add('active');

    // Nếu là phần đặc biệt video thì đảm bảo phát lại
    if (id === "specialVideos") {
        document.querySelectorAll('#specialVideos video').forEach(video => {
            video.play();
        });
    }
}

function goBack() {
    // Dừng tất cả video
    document.querySelectorAll("video").forEach(video => {
        video.pause();
        video.currentTime = 0;
    });

    // Ẩn tất cả section
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Hiện lại menu chính
    document.getElementById("mainMenu").style.display = "flex";
}

function showAlbum(albumId) {
    // Ẩn tất cả album
    document.querySelectorAll('.album').forEach(album => {
        album.classList.remove('active');
    });

    // Ẩn tất cả phần ảnh của các phần
    ['part1Images', 'part2Images', 'part3Images'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });

    // Hiện album được chọn
    document.getElementById(albumId).classList.add('active');
}

// Gán sự kiện click ảnh trong album để mở lightbox (nếu có)
document.addEventListener('DOMContentLoaded', () => {
    const albumImages = document.querySelectorAll('.album img');
    albumImages.forEach(img => {
        img.addEventListener('click', () => {
            showLightbox(img.src); // Hàm showLightbox phải được định nghĩa nếu bạn muốn mở ảnh to
        });
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const videoThumbs = document.querySelectorAll(".video-thumb");

    videoThumbs.forEach(thumb => {
        const previewVideo = thumb.querySelector("video");

        thumb.addEventListener("click", () => {
            const realVideo = document.createElement("video");
            realVideo.src = thumb.dataset.src;
            realVideo.autoplay = true;
            realVideo.muted = true;
            realVideo.loop = true;
            realVideo.playsInline = true;
            realVideo.controls = true;

            thumb.innerHTML = "";
            thumb.appendChild(realVideo);

            observer.observe(realVideo);
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                video.play();
            } else {
                video.pause();
            }
        });
    }, {
        threshold: 0.5
    });
});
