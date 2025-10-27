// backend/server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));// or global fetch in Node 18+
const pdf = require('pdfkit');
const pdfkit = require('pdfkit');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // your frontend
  methods: ['GET', 'POST'],
  credentials: true
}));
const upload = multer({ dest: 'uploads/' });

// helper: extract text based on mimetype / extension
async function extractText(filepath, originalname, mimetype) {
  const ext = path.extname(originalname).toLowerCase();
  if (ext === '.pdf') {
    const dataBuffer = fs.readFileSync(filepath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } else if (ext === '.docx' || mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({path: filepath});
    return result.value;
  } else {
    // fallback: plain text
    return fs.readFileSync(filepath, 'utf8');
  }
}

// POST /upload -> extracts text, calls detector, stores result as JSON
app.post('/upload', upload.single('assignment'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send({error: 'No file uploaded'});
    const text = await extractText(file.path, file.originalname, file.mimetype);

    // call detector service
    const resp = await fetch('http://localhost:5001/detect', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({text})
    });
    const detectResult = await resp.json();

    // compute overall AI percentage: e.g., fraction of sentences with ai_score >= threshold weighted by length
    const THRESH = 0.6; // tuneable
    let flaggedCount = 0;
    let total = detectResult.sentences.length;
    detectResult.sentences.forEach(s => {
      if (s.ai_score >= THRESH) flaggedCount++;
    });
    const ai_percent_by_sentences = total ? (flaggedCount / total) * 100 : 0;
    // optionally: length-weighted percent:
    const totalChars = detectResult.sentences.reduce((a,b)=>a+b.text.length,0);
    let flaggedChars=0;
    detectResult.sentences.forEach(s => {
      if (s.ai_score >= THRESH) flaggedChars += s.text.length;
    });
    const ai_percent_by_chars = totalChars ? (flaggedChars / totalChars) * 100 : 0;

    // Save report object (in-memory or DB). For demo save to file:
    const id = Date.now().toString();
    const report = {
      id,
      filename: file.originalname,
      text,
      detectResult,
      ai_percent_by_sentences,
      ai_percent_by_chars
    };
    fs.writeFileSync(`reports/${id}.json`, JSON.stringify(report,null,2));
    // cleanup uploaded file if desired
    // fs.unlinkSync(file.path);

    res.json({id, ai_percent_by_sentences, ai_percent_by_chars, summary: detectResult});
  } catch(err) {
    console.error(err);
    res.status(500).send({error: err.toString()});
  }
});

// GET /report/:id -> returns JSON report (for frontend)
app.get('/report/:id', (req, res) => {
  try {
    const id = req.params.id;
    const p = `reports/${id}.json`;
    if (!fs.existsSync(p)) return res.status(404).send({error:'Report not found'});
    const data = JSON.parse(fs.readFileSync(p,'utf8'));
    res.json(data);
  } catch(e) {
    res.status(500).send({error:e.toString()});
  }
});

// GET /report/:id/pdf -> generate PDF with highlights and return
app.get('/report/:id/pdf', (req, res) => {
  const id = req.params.id;
  const p = `reports/${id}.json`;
  if (!fs.existsSync(p)) return res.status(404).send({error:'Report not found'});
  const data = JSON.parse(fs.readFileSync(p,'utf8'));
  const doc = new pdfkit({margin:50, size:'A4'});
  res.setHeader('Content-Type','application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="ai_report_${id}.pdf"`);
  doc.pipe(res);

  doc.fontSize(18).text('AI-detection Report', {align:'center'});
  doc.moveDown();
  doc.fontSize(12).text(`Filename: ${data.filename}`);
  doc.text(`AI % (by sentences): ${data.ai_percent_by_sentences.toFixed(2)}%`);
  doc.text(`AI % (by chars): ${data.ai_percent_by_chars.toFixed(2)}%`);
  doc.moveDown();

  // Legend
  doc.fontSize(11).text('Legend:');
  doc.text('• Highlighted sentences are flagged as AI-generated (threshold >= 0.6).');
  doc.moveDown();

  // Write content with simple highlighting: underline flagged sentences or add background rectangles
  const THRESH = 0.6;
  doc.fontSize(10);
  data.detectResult.sentences.forEach(s => {
    if (s.ai_score >= THRESH) {
      // marked/flagged sentence
      doc.fillColor('black').text(s.text + ' ', {continued: false, oblique: false});
      // simple visual marker: insert bracket with AI score
      doc.fillColor('red').text(` [AI ${Math.round(s.ai_score*100)}%]`, {continued: false});
    } else {
      doc.fillColor('black').text(s.text + ' ', {continued: false});
    }
    doc.moveDown(0.2);
  });

  doc.end();
});

app.listen(4000, ()=>console.log('Backend listening on 4000'));
