const searchInput = document.getElementById("searchInput");
const videoCard = document.querySelector(".video-card");

if (searchInput && videoCard) {
  searchInput.addEventListener("keyup", () => {
    const keyword = searchInput.value.toLowerCase();
    const title = videoCard.dataset.title ? videoCard.dataset.title.toLowerCase() : "";

    if (title.includes(keyword)) {
      videoCard.style.display = "block";
    } else {
      videoCard.style.display = "none";
    }
  });
}

function downloadVideo() {
  const mainVideo = document.getElementById("mainVideo");
  if (mainVideo && mainVideo.src) {
    window.open(mainVideo.src, "_blank");
  } else {
    alert("Video tidak ditemukan!");
  }
}

function playAgain() {
  const video = document.getElementById("mainVideo");
  if (video) {
    video.currentTime = 0;
    video.play();
  }
}

// ==========================================
// REMOTE UPLOAD (DISESUAIKAN DENGAN upload.js)
// ==========================================
const remoteInput = document.querySelector(".remote-upload input") || document.querySelectorAll("input")[1];
const uploadBtn = document.querySelector(".remote-upload button") || document.querySelectorAll("button")[2];

if (uploadBtn && remoteInput) {
  uploadBtn.addEventListener("click", async () => {
    const inputUrl = remoteInput.value.trim();

    if (!inputUrl) {
      alert("Masukkan URL video mp4 terlebih dahulu!");
      return;
    }

    uploadBtn.innerText = "Memproses...";
    uploadBtn.disabled = true;

    try {
      // Mengirim dengan parameter 'videoUrl' sesuai kodingan upload.js kamu
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ videoUrl: inputUrl })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Encode URL video agar bisa dijadikan parameter link web kamu
        const encodedUrl = encodeURIComponent(inputUrl);
        
        // Membuat link baru berdomain web KAMU SENDIRI
        const myWebLink = `${window.location.origin}/?v=${encodedUrl}`;
        
        // Tampilkan link web kamu ke pengguna
        prompt("Upload Berhasil! Ini link web kamu:", myWebLink);
        
        // Memutar langsung videonya di player web
        const mainVideo = document.getElementById("mainVideo");
        if (mainVideo) {
          mainVideo.src = inputUrl;
          mainVideo.play();
        }
      } else {
        alert("Gagal upload: " + (data.message || data.error || "Gagal memproses video"));
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi ke /api/upload");
    } finally {
      uploadBtn.innerText = "Upload Sekarang";
      uploadBtn.disabled = false;
      remoteInput.value = "";
    }
  });
}

// ==========================================
// AUTO PLAY JIKA WEB DIBUKA LEWAT LINK HASIL UPLOAD
// ==========================================
window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const videoFromLink = urlParams.get("v");

  if (videoFromLink) {
    const mainVideo = document.getElementById("mainVideo");
    if (mainVideo) {
      mainVideo.src = decodeURIComponent(videoFromLink);
      mainVideo.play();
    }
  }
});
