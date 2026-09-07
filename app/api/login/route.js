import { NextResponse } from 'next/server';
import { turso } from '../../../lib/turso';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // Eksekusi query ke database Turso
    const result = await turso.execute({
      sql: "SELECT * FROM Users WHERE Username = ? AND Password = ?",
      args: [username, password]
    });

    if (result.rows.length > 0) {
      const user = result.rows[0];
      
      // Membuat token keamanan
      const token = jwt.sign(
        { id: user.ID, role: user.Role },
        process.env.JWT_SECRET || 'rahasia_super_aman_cbt_123',
        { expiresIn: '6h' }
      );

      return NextResponse.json({
        status: 'success',
        data: user,
        token: token,
        logo: 'https://lh3.googleusercontent.com/d/1OWPGumIzn-RRd3FfrMmYzPt6ZGOnNZpY'
      });
    }

    return NextResponse.json({ status: 'error', msg: 'Username atau Password salah!' });
    
  } catch (error) {
    // Mencetak eror asli Turso ke CMD Windows Anda
    console.error("API Login Error:", error);
    return NextResponse.json({ status: 'error', msg: error.message }, { status: 500 });
  }
}