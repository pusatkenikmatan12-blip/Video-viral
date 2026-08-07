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
// REMOTE UPLOAD & AUTO-FILL LINK WEB KAMU
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const remoteInput = document.querySelectorAll("input")[1] || document.querySelector(".remote-upload input");
  const uploadBtn = document.querySelectorAll("button")[2] || document.querySelector(".remote-upload button");
  
  // Mengambil input kotak hasil bawah & tombol copy
  const resultInput = document.querySelectorAll("input")[2] || document.querySelector("#resultLink");
  const resultBox = document.querySelector(".result-box") || document.querySelector("#resultContainer");

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
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoUrl: inputUrl })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Buat link baru berdomain web kamu
          const encodedUrl = encodeURIComponent(inputUrl);
          const myWebLink = window.location.origin + "/?v=" + encodedUrl;

          // Tempelkan link web kamu ke kotak hasil di bawah "Link Video Kamu:"
          if (resultInput) {
            resultInput.value = myWebLink;
          }

          // Munculkan kontainer teks "Berhasil dimuat!"
          if (resultBox) {
            resultBox.style.display = "block";
          }

          // Putar video di player utama
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

  // BACA PARAMETER LINK DARI BROWSER SAAT DIBUKA
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
