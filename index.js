const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, nama, order_id, tanggal, jam_mulai, jam_akhir, total_biaya } = req.body;

  if (!email || !nama || !order_id) {
    return res.status(400).json({ message: 'email, nama, dan order_id wajib diisi' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Booking Lapangan App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Invoice Pemesanan Lapangan - ${order_id}`,
      html: `
        <h2>Invoice Pemesanan Lapangan</h2>
        <p>Halo ${nama},</p>
        <p>Berikut detail pemesanan Anda:</p>
        <ul>
          <li><strong>Order ID:</strong> ${order_id}</li>
          <li><strong>Tanggal:</strong> ${tanggal}</li>
          <li><strong>Jam:</strong> ${jam_mulai} - ${jam_akhir}</li>
          <li><strong>Total Biaya:</strong> Rp ${total_biaya}</li>
        </ul>
        <p>Terima kasih atas pemesanan Anda.</p>
        <p><em>Booking Lapangan App</em></p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email berhasil dikirim' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengirim email', error: error.toString() });
  }
}
