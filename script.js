const searchInput = document.getElementById("searchInput");
const videoCard = document.querySelector(".video-card");

searchInput.addEventListener("keyup", () => {

const keyword = searchInput.value.toLowerCase();
const title = videoCard.dataset.title.toLowerCase();

if(title.includes(keyword)){
videoCard.style.display = "block";
}else{
videoCard.style.display = "none";
}

});

function downloadVideo(){
window.open(
"https://cdn2.sliwtdrive.com/BIYDvcux1.mp4",
"_blank"
);
}

function playAgain(){
const video = document.getElementById("mainVideo");
video.currentTime = 0;
video.play();
}
