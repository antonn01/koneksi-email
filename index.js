const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, nama, order_id, tanggal, jam_mulai, jam_akhir, total_biaya, lapangan_number, status_transaksi } = req.body;

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
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
    <div style="text-align: center;">
      <h2 style="color: #4DA1FF;">Invoice Pemesanan Lapangan</h2>
      <p style="font-size: 16px;">Halo <strong>${nama}</strong>,</p>
    </div>
    <p style="font-size: 15px;">Terima kasih telah melakukan pemesanan. Berikut adalah detail transaksi Anda:</p>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <tr style="background-color: #f2f2f2;">
        <td style="padding: 10px;"><strong>Order ID</strong></td>
        <td style="padding: 10px;">${order_id}</td>
      </tr>
      <tr>
        <td style="padding: 10px;"><strong>Tanggal</strong></td>
        <td style="padding: 10px;">${tanggal}</td>
      </tr>
      <tr style="background-color: #f2f2f2;">
        <td style="padding: 10px;"><strong>Jam</strong></td>
        <td style="padding: 10px;">${jam_mulai} - ${jam_akhir}</td>
      </tr>
      <tr>
        <td style="padding: 10px;"><strong>Lapangan</strong></td>
        <td style="padding: 10px;">Nomor ${lapangan_number}</td>
      </tr>
      <tr style="background-color: #f2f2f2;">
        <td style="padding: 10px;"><strong>Total Biaya</strong></td>
        <td style="padding: 10px;">Rp ${total_biaya.toLocaleString('id-ID')}</td>
      </tr>
      <tr>
        <td style="padding: 10px;"><strong>Status</strong></td>
        <td style="padding: 10px;">${status_transaksi}</td>
      </tr>
    </table>
    <div style="margin-top: 30px; text-align: center;">
      <p style="font-size: 14px; color: #777;">Jika ada pertanyaan, silakan hubungi kami melalui aplikasi atau email.</p>
      <p style="font-size: 14px;"><em>Salam,</em><br><strong>Booking Lapangan App</strong></p>
    </div>
  </div>
`

    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email berhasil dikirim' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengirim email', error: error.toString() });
  }
}
