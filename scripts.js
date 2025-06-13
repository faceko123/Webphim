document.addEventListener("DOMContentLoaded", function () {
  const playButton = document.getElementById("playButton");
  const trailerContainer = document.getElementById("trailerContainer");

  playButton.addEventListener("click", function () {
    trailerContainer.style.display = "block";
    playButton.style.display = "none"; // Ẩn nút sau khi nhấn
  });
});
