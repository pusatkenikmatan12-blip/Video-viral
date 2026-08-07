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
// REMOTE UPLOAD (PASTIIN MASUK KE KOTAK HASIL DOMAIN KAMU)
// ==========================================
const remoteInput = document.querySelector(".remote-upload input") || document.querySelectorAll("input")[1];
const uploadBtn = document.querySelector(".remote-upload button") || document.querySelectorAll("button")[2];

// Mengambil elemen tempat nampilin link di bawah "Link Video Kamu:"
const resultInput = document.querySelector("#resultLink") || document.querySelectorAll("input")[2]; 
const resultContainer = document.querySelector("#resultContainer") || document.querySelector(".result-box");

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
        // Encode URL video
        const encodedUrl = encodeURIComponent(inputUrl);
        
        // BIKIN LINK BERDOMAIN WEB KAMU SENDIRI
        const myWebLink = window.location.origin + "/?v=" + encodedUrl;
        
        // TEMPELKAN KE KOTAK INPUT HASIL (Bawah "Link Video Kamu:")
        if (resultInput) {
          resultInput.value = myWebLink;
        }
        
        // Tampilkan kontainer hasil jika tadinya tersembunyi
        if (resultContainer) {
          resultContainer.style.display = "block";
        }

        // Putar videonya di player atas
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
