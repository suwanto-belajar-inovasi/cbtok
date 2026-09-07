import { NextResponse } from 'next/server';
import { turso } from '../../../lib/turso';

export async function POST(req) {
  try {
    const { role, userId, kelas } = await req.json();
    let output = { logo: 'https://lh3.googleusercontent.com/d/1OWPGumIzn-RRd3FfrMmYzPt6ZGOnNZpY' };

    if (role === 'admin' || role === 'guru') {
      const exams = await turso.execute("SELECT * FROM Exams");
      const users = await turso.execute("SELECT * FROM Users WHERE Role = 'siswa'");

      output.exams = exams.rows;
      output.stats = {
        totalSiswa: users.rows.length,
        totalUjian: exams.rows.length,
        activeUjian: exams.rows.filter(e => e.Status === 'Aktif').length
      };
      
    } else if (role === 'siswa') {
      const exams = await turso.execute("SELECT * FROM Exams WHERE Status = 'Aktif'");
      output.availableExams = exams.rows;
      output.history = []; 
    }

    return NextResponse.json({ status: 'success', data: output });
    
  } catch (error) {
    console.error("API Dashboard Error:", error);
    return NextResponse.json({ status: 'error', msg: error.message }, { status: 500 });
  }
}