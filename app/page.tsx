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
        background: "linear-gradient(135deg, rgba(30,58,138,0.9) 0%, rgba(59,130,246,0.9) 100%)",
        padding: '20px'
      }}>
        
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          width: '100%',
          maxWidth: '420px',
          padding: '40px',
          zIndex: 2
        }}>
          
          <div className="text-center mb-4">
            {/* Ganti tautan (src) gambar di bawah ini jika Anda memiliki link logo KKGMI yang spesifik */}
            <img 
              src="https://lh3.googleusercontent.com/d/1SCvmdQxuqmX_f0gBaYt0Ob53Tws97Hnq" 
              className="mb-3 rounded" 
              width="100" 
              alt="Logo KKGMI" 
            />
            <h4 className="fw-bold text-center" style={{ color: '#0d6efd' }}>
              KKGMI SURABAYA 10<br/>
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

            <div className="form-floating mb-4">
              <input 
                type="date" 
                className="form-control" 
                required 
                value={tglLahir} 
                onChange={(e) => setTglLahir(e.target.value)} 
              />
              <label>Tanggal Lahir</label>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary w-100 py-2 fw-bold shadow-sm"
              style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd' }}
            >
              {loading ? 'MEMPROSES...' : 'MASUK SEKARANG'}
            </button>
          </form>
        </div>

        <div className="text-center mt-3 text-white small z-3">
          © 2026 KKGMI SURABAYA 10 @support by Belajar Inovasi
        </div>

      </div>
    </>
  );
}