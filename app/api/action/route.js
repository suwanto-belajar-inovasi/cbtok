export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { turso } from '../../../lib/turso';

export async function POST(req) {
  try {
    const { action, args } = await req.json();

    if (action === 'getDashboardData') {
      const [role, userId, kelas, sekolah] = args;
      let exams, users;
      if (role === 'guru') {
        exams = await turso.execute({ sql: "SELECT * FROM Exams WHERE PembuatID = ?", args: [userId] });
        users = await turso.execute({ sql: "SELECT * FROM Users WHERE Role = 'siswa' AND Sekolah = ?", args: [sekolah] });
      } else {
        exams = await turso.execute("SELECT * FROM Exams");
        users = await turso.execute("SELECT * FROM Users WHERE Role = 'siswa'");
      }
      
      let output = { logo: 'https://lh3.googleusercontent.com/d/1OWPGumIzn-RRd3FfrMmYzPt6ZGOnNZpY' };
      if (role === 'admin' || role === 'guru') {
        output.exams = exams.rows;
        output.stats = { totalSiswa: users.rows.length, totalUjian: exams.rows.length, activeUjian: exams.rows.filter(e => e.Status === 'Aktif').length };
      } else if (role === 'siswa') {
        output.availableExams = exams.rows.filter(e => e.Status === 'Aktif');
        const history = await turso.execute({ 
          sql: "SELECT r.ResultID, r.ExamID, r.WaktuSubmit, r.TotalNilai as Nilai, e.Judul, e.AllowDownloadR, e.AllowDownloadQ, r.Pelanggaran FROM Results r JOIN Exams e ON r.ExamID = e.ExamID WHERE r.SiswaID = ?", 
          args: [userId] 
        });
        output.history = history.rows;
      }
      return NextResponse.json({ status: 'success', data: output });
    }

    if (action === 'getAdminData') {
      const [role, userId, kelas, sekolah] = args;
      let exams, users;
      if (role === 'guru') {
        exams = await turso.execute({ sql: "SELECT * FROM Exams WHERE PembuatID = ?", args: [userId] });
        users = await turso.execute({ sql: "SELECT * FROM Users WHERE Role = 'siswa' AND Sekolah = ?", args: [sekolah] });
      } else {
        exams = await turso.execute("SELECT * FROM Exams");
        users = await turso.execute("SELECT * FROM Users WHERE Role = 'siswa'");
      }
      return NextResponse.json({ status: 'success', exams: exams.rows, users: users.rows, logo: 'https://lh3.googleusercontent.com/d/1OWPGumIzn-RRd3FfrMmYzPt6ZGOnNZpY' });
    }

    if (action === 'getUserList') {
      const [role, uid, sekolah] = args;
      let users;
      if (role === 'guru') users = await turso.execute({ sql: "SELECT * FROM Users WHERE Role = 'siswa' AND Sekolah = ?", args: [sekolah] });
      else users = await turso.execute("SELECT * FROM Users"); 
      return NextResponse.json({ status: 'success', data: users.rows });
    }

    if (action === 'adminManageUser') {
      const mode = args[0]; const d = args[1];
      if (mode === 'save') {
        const id = d.id || ('U' + Date.now());
        const cek = await turso.execute({ sql: "SELECT ID FROM Users WHERE ID = ?", args: [id] });
        if (cek.rows.length > 0) {
          await turso.execute({ sql: "UPDATE Users SET Nama=?, Username=?, Password=?, Role=?, Sekolah=?, Kelas=?, TglLahir=?, Foto=? WHERE ID=?", args: [d.nama, d.username, d.password, d.role, d.sekolah, d.kelas, d.tglLahir, d.foto, id] });
        } else {
          await turso.execute({ sql: "INSERT INTO Users (ID, Nama, Username, Password, Role, Sekolah, Kelas, TglLahir, Foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", args: [id, d.nama, d.username, d.password, d.role, d.sekolah, d.kelas, d.tglLahir, d.foto] });
        }
      } else if (mode === 'delete') {
        await turso.execute({ sql: "DELETE FROM Users WHERE ID = ?", args: [d.id] });
      }
      return NextResponse.json({ status: 'success', msg: 'Data User berhasil disimpan!' });
    }

    if (action === 'adminSaveExam') {
      const d = args[0]; const id = d.examId || ('EX' + Date.now());
      const cek = await turso.execute({ sql: "SELECT ExamID FROM Exams WHERE ExamID = ?", args: [id] });
      if (cek.rows.length > 0) {
        await turso.execute({ sql: "UPDATE Exams SET Judul=?, Mapel=?, TargetKelas=?, Durasi=?, Token=?, StartDate=?, EndDate=?, LimitTries=?, ShowStats=?, RandomQ=?, AllowDownloadQ=?, AllowDownloadR=? WHERE ExamID=?", args: [d.judul, d.mapel, d.targetKelas, d.durasi, d.token || '', d.start, d.end, d.limit || 1, d.showStats, d.randomQ, d.dlSoal, d.dlHasil, id] });
      } else {
        await turso.execute({ sql: "INSERT INTO Exams (ExamID, Judul, Mapel, TargetKelas, Durasi, Token, StartDate, EndDate, LimitTries, ShowStats, RandomQ, AllowDownloadQ, AllowDownloadR, PembuatID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", args: [id, d.judul, d.mapel, d.targetKelas, d.durasi, d.token || '', d.start, d.end, d.limit || 1, d.showStats, d.randomQ, d.dlSoal, d.dlHasil, d.userId] });
      }
      return NextResponse.json({ status: 'success', msg: 'Jadwal Ujian berhasil dibuat!' });
    }

    if (action === 'adminDeleteExam') {
      await turso.execute({ sql: "DELETE FROM Exams WHERE ExamID = ?", args: [args[0]] });
      return NextResponse.json({ status: 'success', msg: 'Jadwal Ujian berhasil dihapus!' });
    }

    if (action === 'getExamQuestions' || action === 'getSiswaSoal') {
      const qs = await turso.execute({ sql: "SELECT * FROM Questions WHERE ExamID = ?", args: [args[0]] });
      return NextResponse.json(qs.rows);
    }

    if (action === 'adminSaveSingleQuestion') {
      const eid = args[0]; const d = args[1]; const userId = args[2]; const id = d.id || ('Q' + Date.now());
      const cek = await turso.execute({ sql: "SELECT QID FROM Questions WHERE QID = ?", args: [id] });
      if (cek.rows.length > 0) {
        await turso.execute({ sql: "UPDATE Questions SET Tipe=?, Pertanyaan=?, Options=?, Key=?, Skor=?, Nomor=? WHERE QID=?", args: [d.type, d.text, JSON.stringify(d.options), JSON.stringify(d.key), d.score, d.num, id] });
      } else {
        await turso.execute({ sql: "INSERT INTO Questions (QID, ExamID, Tipe, Pertanyaan, Options, Key, Skor, Nomor, PembuatID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", args: [id, eid, d.type, d.text, JSON.stringify(d.options), JSON.stringify(d.key), d.score, d.num, userId] });
      }
      return NextResponse.json({ status: 'success', id: id, msg: 'Soal tersimpan!' });
    }

    if (action === 'adminDeleteQuestion') {
      await turso.execute({ sql: "DELETE FROM Questions WHERE QID = ?", args: [args[0]] });
      return NextResponse.json({ status: 'success', msg: 'Soal dihapus!' });
    }

    if (action === 'adminBatchSaveQuestions') {
      const eid = args[0]; const qArr = args[1]; const userId = args[2];
      for(let q of qArr) {
         const id = 'Q' + Date.now() + Math.floor(Math.random()*1000);
         await turso.execute({ sql: "INSERT INTO Questions (QID, ExamID, Tipe, Pertanyaan, Options, Key, Skor, Nomor, PembuatID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", args: [id, eid, q.type, q.text, JSON.stringify(q.options), JSON.stringify(q.key), q.score, q.num, userId] });
      }
      return NextResponse.json({ status: 'success', msg: `${qArr.length} soal diupload!` });
    }

    if (action === 'getExamPack') {
      const eid = args[0]; const uid = args[1];
      const history = await turso.execute({ sql: "SELECT * FROM Results WHERE ExamID=? AND SiswaID=?", args: [eid, uid]});
      if(history.rows.length > 0) return NextResponse.json({status: 'error', msg: 'Ujian sudah dikerjakan.'});
      const examInfo = await turso.execute({ sql: "SELECT * FROM Exams WHERE ExamID=?", args:[eid] });
      const qs = await turso.execute({ sql: "SELECT * FROM Questions WHERE ExamID=?", args:[eid] });
      const cleanQ = qs.rows.map(q => ({ QID: q.QID, Tipe: q.Tipe, Pertanyaan: q.Pertanyaan, Options: q.Options, Nomor: q.Nomor, Extra: [] }));
      return NextResponse.json({ status: 'success', data: cleanQ, duration: examInfo.rows[0].Durasi, judul: examInfo.rows[0].Judul, token: examInfo.rows[0].Token });
    }

    if (action === 'submitExam') {
       const uid = args[0]; const eid = args[1]; const answers = args[2]; const violations = args[3];
       let totalScore = 0; let detailLog = [];
       const qs = await turso.execute({ sql: "SELECT * FROM Questions WHERE ExamID=?", args:[eid] });
       answers.forEach(ans => {
          const q = qs.rows.find(x => x.QID === ans.qid);
          if(q) {
             const keys = JSON.parse(q.Key || "[]");
             const scoreEarned = keys.includes(ans.answer) ? q.Skor : 0;
             totalScore += scoreEarned;
             detailLog.push({ i: q.Nomor, s: scoreEarned, m: q.Skor, t: q.Tipe, a: ans.answer });
          }
       });
       await turso.execute({ sql: "INSERT INTO Results (ResultID, SiswaID, ExamID, TotalNilai, Detail, Pelanggaran) VALUES (?, ?, ?, ?, ?, ?)", args: ['RES' + Date.now(), uid, eid, totalScore, JSON.stringify(detailLog), violations > 0 ? `Pelanggaran: ${violations}x` : "-"] });
       return NextResponse.json({ status: 'success', msg: 'Berhasil dikirim', data: { score: totalScore } });
    }

    if (action === 'getRecapList') {
      const [role, userId, sekolah] = args;
      let query = `
        SELECT r.ResultID, r.TotalNilai, r.WaktuSubmit, r.Detail, r.SiswaID, r.ExamID, r.Pelanggaran,
               u.Nama AS NamaSiswa, u.Kelas AS KelasSiswa, u.Sekolah AS SekolahSiswa,
               e.Judul AS JudulUjian, e.Mapel AS Mapel, e.PembuatID AS PembuatID,
               (SELECT Nama FROM Users WHERE ID = e.PembuatID) AS PembuatNama
        FROM Results r
        LEFT JOIN Users u ON r.SiswaID = u.ID
        LEFT JOIN Exams e ON r.ExamID = e.ExamID
      `;
      if (role === 'guru') query += ` WHERE e.PembuatID = '${userId}' AND u.Sekolah = '${sekolah}'`;
      
      const results = await turso.execute(query);
      return NextResponse.json({ status: 'success', data: results.rows });
    }

    if (action === 'getSiswaDetailHasil') {
      const rid = args[0];
      const results = await turso.execute({ sql: "SELECT r.TotalNilai, r.Detail, e.Judul, e.Mapel FROM Results r JOIN Exams e ON r.ExamID = e.ExamID WHERE r.ResultID = ?", args: [rid] });
      return NextResponse.json({ status: 'success', data: results.rows[0] });
    }

    if (action === 'adminUpdateResult') {
       await turso.execute({ sql: "UPDATE Results SET TotalNilai=?, Detail=? WHERE ResultID=?", args: [args[1], args[2], args[0]] });
       return NextResponse.json({ status: 'success', msg: 'Nilai dan Koreksi diperbarui.' });
    }
    
    if (action === 'adminDeleteResult') {
       await turso.execute({ sql: "DELETE FROM Results WHERE ResultID=?", args: [args[0]] });
       return NextResponse.json({ status: 'success', msg: 'Hasil Dihapus!' });
    }

    if (action === 'requestResetResult') {
       await turso.execute({ sql: "UPDATE Results SET Pelanggaran = 'Meminta Reset (Trobel)' WHERE ResultID=?", args: [args[0]] });
       return NextResponse.json({ status: 'success', msg: 'Berhasil dilaporkan' });
    }

    if (action === 'getLiveMonitoring') {
       const [id, role, sekolah] = args;
       let sql = "SELECT * FROM Users WHERE Role='siswa'";
       let pArgs = [];
       if (role === 'guru') { sql += " AND Sekolah = ?"; pArgs.push(sekolah); }
       const users = await turso.execute({ sql: sql, args: pArgs });
       return NextResponse.json({ status: 'success', data: users.rows.map(u => ({ id: u.ID, nama: u.Nama, kelas: u.Kelas, terjawab: 0, total: 10, status: 'Offline' })) });
    }

    if (action === 'sysResetCache' || action === 'updateClientProgress' || action === 'autosaveAnswer') return NextResponse.json({ status: 'success' });
    return NextResponse.json({ status: 'success', data: [] });
  } catch (error) {
    console.error("API Action Error:", error);
    return NextResponse.json({ status: 'error', msg: error.message }, { status: 500 });
  }
}