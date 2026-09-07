'use client';

import { useState } from 'react';

export default function Page() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tglLahir, setTglLahir] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />

      <div style={{
        fontFamily: "'Poppins', sans-serif",
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        /* Perpaduan Hijau dan Emas yang elegan */
        background: "linear-gradient(135deg, #0f5132 0%, #d4af37 100%)",
        padding: '20px',
        margin: 0
      }}>
        
        <div style={{
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          width: '100%',
          maxWidth: '400px',
          padding: '40px',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch'
        }}>
          
          <div className="text-center mb-4">
            <img 
              src="https://lh3.googleusercontent.com/d/1SCvmdQxuqmX_f0gBaYt0Ob53Tws97Hnq" 
              className="mb-3 rounded" 
              width="90" 
              alt="Logo KKGMI" 
            />
            <h4 className="fw-bold text-center" style={{ color: '#0d6efd', fontSize: '22px' }}>
              KKGMI SURABAYA 10
            </h4>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-floating mb-3">
              <input 
                type="text" 
                className="form-control" 
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
                className="form-control" 
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

            {/* Hapus atribut "required" agar Guru/Admin tidak wajib isi TTL */}
            <div className="form-floating mb-4">
              <input 
                type="date" 
                className="form-control" 
                value={tglLahir} 
                onChange={(e) => setTglLahir(e.target.value)} 
              />
              <label>Tanggal Lahir (Khusus Siswa)</label>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary w-100 py-3 fw-bold shadow-sm"
              style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd', fontSize: '16px', borderRadius: '8px' }}
            >
              {loading ? 'MEMPROSES...' : 'MASUK SEKARANG'}
            </button>
          </form>
        </div>

        <div className="text-center mt-4 text-white small z-3">
          © 2026 KKGMI SURABAYA 10 @support by Belajar Inovasi
        </div>

      </div>
    </>
  );
}