'use client';

import { useState, useEffect } from 'react';

export default function Page() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tglLahir, setTglLahir] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mencegah login ulang jika sesi masih aktif saat direload
  useEffect(() => {
    const savedUser = localStorage.getItem('cbt_user');
    if (savedUser) {
      window.location.href = '/index.html';
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, tglLahir })
      });
      
      const result = await res.json();

      if (result.status === 'success') {
        const user = result.data;
        user.LogoUrl = result.logo;
        localStorage.setItem('cbt_user', JSON.stringify(user));
        
        window.location.href = '/index.html';
      } else {
        alert('Gagal Login: ' + result.msg);
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan atau server tidak merespons.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />

      <div style={{
        fontFamily: "'Poppins', sans-serif",
        minHeight: '100vh',
        width: '100%',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: "linear-gradient(135deg, #064e3b 0%, #15803d 50%, #d4af37 100%)",
        padding: '20px'
      }}>
        
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div className="row g-4 align-items-center">
            
            <div className="col-lg-7 text-white pe-lg-4 mb-4 mb-lg-0">
              <h2 className="fw-bold mb-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>Tryout TKA KKGMI Surabaya 10</h2>
              <p className="lead mb-4" style={{ fontSize: '1.1rem', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                Selamat datang di Aplikasi Computer Based Test (CBT) resmi Kelompok Kerja Guru Madrasah Ibtidaiyah (KKGMI) Kota Surabaya 10.
              </p>
              
              <div className="bg-white text-dark p-4 rounded-4 shadow-sm mb-4" style={{ opacity: 0.95 }}>
                <h5 className="fw-bold text-success mb-3"><i className="fas fa-list-check me-2"></i>Aturan & Cara Mengerjakan</h5>
                <ul className="mb-0 small" style={{ paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                  <li>Pastikan koneksi internet Anda stabil sebelum mulai ujian.</li>
                  <li>Sistem akan otomatis beralih ke mode <b>Layar Penuh (Fullscreen)</b>.</li>
                  <li><b>DILARANG</b> membuka tab baru, aplikasi lain, atau membagi layar (Split Screen). Pelanggaran maksimal 3 kali akan membuat jawaban otomatis terkirim.</li>
                  <li>Tombol <b>Selesai Ujian</b> hanya akan muncul di soal nomor terakhir. Gunakan tombol <b>Ragu-ragu</b> jika ingin menandai soal yang belum yakin.</li>
                </ul>
              </div>

              <div className="bg-white text-dark p-4 rounded-4 shadow-sm" style={{ opacity: 0.95 }}>
  <h5 className="fw-bold text-success mb-3">
    <i className="fas fa-calendar-alt me-2"></i>
    Jadwal Pelaksanaan
  </h5>

  <div className="row g-3 small">

    {/* TRYOUT 1 */}
    <div className="col-lg-6">
      <div className="border rounded-3 p-3 h-100">
        <div className="fw-bold text-primary mb-2">
          Tryout 1 (14–17 Desember 2026)
        </div>

        <div className="mb-2">
          <strong>Gelombang 1</strong><br />
          <small>14–15 Desember 2026</small>
          <ul className="mb-2 ps-3">
            <li>Sesi 1 : 07.30 – 09.00 WIB</li>
            <li>Sesi 2 : 09.30 – 11.00 WIB</li>
            <li>Sesi 3 : 11.30 – 13.00 WIB</li>
          </ul>
        </div>

        <div>
          <strong>Gelombang 2</strong><br />
          <small>16–17 Desember 2026</small>
          <ul className="mb-0 ps-3">
            <li>Sesi 1 : 07.30 – 09.00 WIB</li>
            <li>Sesi 2 : 09.30 – 11.00 WIB</li>
            <li>Sesi 3 : 11.30 – 13.00 WIB</li>
          </ul>
        </div>
      </div>
    </div>

    {/* TRYOUT 2 */}
    <div className="col-lg-6">
      <div className="border rounded-3 p-3 h-100">
        <div className="fw-bold text-primary mb-2">
          Tryout 2 (25–28 Januari 2027)
        </div>

        <div className="mb-2">
          <strong>Gelombang 1</strong><br />
          <small>25–26 Januari 2027</small>
          <ul className="mb-2 ps-3">
            <li>Sesi 1 : 07.30 – 09.00 WIB</li>
            <li>Sesi 2 : 09.30 – 11.00 WIB</li>
            <li>Sesi 3 : 11.30 – 13.00 WIB</li>
          </ul>
        </div>

        <div>
          <strong>Gelombang 2</strong><br />
          <small>27–28 Januari 2027</small>
          <ul className="mb-0 ps-3">
            <li>Sesi 1 : 07.30 – 09.00 WIB</li>
            <li>Sesi 2 : 09.30 – 11.00 WIB</li>
            <li>Sesi 3 : 11.30 – 13.00 WIB</li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</div>

            <div className="col-lg-5">
              <div style={{
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                width: '100%',
                padding: '40px',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch'
              }}>
                
                <div className="text-center mb-4">
                  <img 
                    src="https://lh3.googleusercontent.com/d/1SCvmdQxuqmX_f0gBaYt0Ob53Tws97Hnq" 
                    className="mx-auto d-block mb-3 rounded" 
                    width="90" 
                    alt="Logo KKGMI" 
                  />
                  <h4 className="fw-bold text-center" style={{ color: '#064e3b', fontSize: '22px' }}>
                    MASUK UJIAN
                  </h4>
                </div>

                <form onSubmit={handleLogin} style={{ width: '100%' }}>
                  <div className="form-floating mb-3">
                    <input 
                      type="text" 
                      className="form-control bg-light border-0" 
                      placeholder="User" 
                      required 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                    />
                    <label>Username</label>
                  </div>

                  <div className="form-floating mb-3 position-relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="form-control bg-light border-0" 
                      placeholder="Pass" 
                      required 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                    />
                    <label>Password</label>
                    <i 
                      className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} position-absolute top-50 end-0 translate-middle-y me-3 text-muted`} 
                      style={{ cursor: 'pointer', zIndex: 10, fontSize: '1.2rem' }}
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  </div>

                  <div className="form-floating mb-4">
                    <input 
                      type="date" 
                      className="form-control bg-light border-0" 
                      value={tglLahir} 
                      onChange={(e) => setTglLahir(e.target.value)} 
                    />
                    <label>Tanggal Lahir (Siswa Wajib Isi)</label>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="btn w-100 py-3 fw-bold shadow-sm text-white"
                    style={{ background: 'linear-gradient(90deg, #064e3b 0%, #15803d 100%)', border: 'none', fontSize: '16px', borderRadius: '10px' }}
                  >
                    {loading ? 'MEMPROSES...' : 'MASUK SEKARANG'}
                  </button>
                </form>

                <div className="text-center mt-4 small text-muted">
                  © 2026 KKGMI SURABAYA 10<br/>@support by Belajar Inovasi
                </div>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </>
  );
}
