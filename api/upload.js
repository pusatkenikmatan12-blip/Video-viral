export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ message: 'URL video wajib diisi' });
  }

  try {
    const response = await fetch(videoUrl);
    
    if (!response.ok) {
      throw new Error('Gagal mengambil file video dari URL tersebut.');
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return res.status(200).json({ 
      success: true, 
      message: 'Berhasil menarik video!',
      size: buffer.length 
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
