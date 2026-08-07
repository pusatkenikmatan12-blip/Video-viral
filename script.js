const remoteInput = document.querySelector(".remote-upload input") || document.querySelectorAll("input")[1];
const uploadBtn = document.querySelector(".remote-upload button") || document.querySelectorAll("button")[2];

if (uploadBtn && remoteInput) {
  uploadBtn.addEventListener("click", async () => {
    const videoUrl = remoteInput.value.trim();

    if (!videoUrl) {
      alert("Masukkan URL video terlebih dahulu!");
      return;
    }

    uploadBtn.innerText = "Processing...";

    try {
      // Mengirim link luar ke API di folder /api kamu
      const response = await fetch("/api/upload", { // Sesuaikan nama file di dalam folder /api kamu (misal /api/upload atau /api/remote)
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: videoUrl })
      });

      const data = await response.json();

      if (data.success || data.link) {
        // Tampilkan hasil link baru yang berdomain web KAMU SENDIRI
        const newWebLink = data.link || `https://video-viral-swart.vercel.app/?v=${data.id}`;
        
        // Buat pop-up / alert berisi link web kamu
        prompt("Upload Berhasil! Ini link web kamu:", newWebLink);
      } else {
        alert("Gagal memproses video dari API!");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengubung ke API.");
    } finally {
      uploadBtn.innerText = "Upload Sekarang";
    }
  });
}
