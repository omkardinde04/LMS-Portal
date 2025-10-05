# server.py
import os, io, re, json
from flask import Flask, request, jsonify, send_file
import joblib
import pandas as pd
import magic
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from nltk import sent_tokenize
from math import ceil

app = Flask(__name__)

MODEL_PATH = "models/tfidf_lr_ai_detector.joblib"
model = joblib.load(MODEL_PATH)

# chunking: split by paragraphs or by N sentences
def split_into_windows(text, sentences_per_window=4):
    sents = sent_tokenize(text)
    if len(sents) == 0:
        return []
    windows = []
    for i in range(0, len(sents), sentences_per_window):
        win = " ".join(sents[i:i+sentences_per_window])
        windows.append({"start_sent": i, "end_sent": i+sentences_per_window-1, "text": win})
    return windows

# classify windows
def classify_windows(windows):
    texts = [w['text'] for w in windows]
    probs = model.predict_proba(texts)[:,1]  # probability of AI
    results = []
    for w,p in zip(windows, probs):
        results.append({**w, "ai_prob": float(p)})
    return results

# create a simple PDF report highlighting AI windows
def make_pdf_report(title, original_text, window_results, out_path):
    c = canvas.Canvas(out_path, pagesize=letter)
    width, height = letter
    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, height-40, title)
    c.setFont("Helvetica", 10)
    # summary
    ai_windows = [w for w in window_results if w['ai_prob']>=0.5]
    percent_ai = len(ai_windows)/len(window_results)*100 if window_results else 0
    c.drawString(40, height-60, f"AI-generated percentage (windows): {percent_ai:.1f}%")
    # list flagged windows with probs
    y = height-90
    c.setFont("Helvetica-Bold", 11)
    c.drawString(40, y, "Flagged windows (probabilities):")
    y -= 18
    c.setFont("Helvetica", 9)
    for w in sorted(ai_windows, key=lambda x:-x['ai_prob']):
        # write a short excerpt
        excerpt = (w['text'][:200] + '...') if len(w['text'])>200 else w['text']
        c.drawString(45, y, f"{w['ai_prob']:.2f} — {excerpt}")
        y -= 14
        if y < 80:
            c.showPage(); y = height-40
    c.showPage()
    # full text with simple highlight markers: we'll insert [AI_START]... [AI_END] around flagged windows
    full_text = original_text
    # naive approach: rebuild text window by window and mark
    # For the PDF, just print the whole text and then list flagged windows. (Avoid complex text flow)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(40, height-40, "Full Text (unmodified):")
    c.setFont("Helvetica", 9)
    y = height-70
    for line in full_text.splitlines():
        c.drawString(40, y, line[:1000])
        y -= 12
        if y < 40:
            c.showPage(); y = height-40
    c.save()

@app.route("/analyze", methods=["POST"])
def analyze():
    """
    Accepts form-data:
      - file: uploaded file or
      - text: raw text
      - filename (optional)
      - sentences_per_window (optional)
    Returns JSON with per-window ai probability, overall percent, and link to PDF report.
    """
    sentences_per_window = int(request.form.get("sentences_per_window", 4))
    text = None
    if 'text' in request.form and request.form['text'].strip():
        text = request.form['text']
        filename = request.form.get("filename", "pasted_text.txt")
    elif 'file' in request.files:
        f = request.files['file']
        filename = f.filename
        # Only handle text-like files for now
        data = f.read()
        try:
            kind = magic.from_buffer(data, mime=True)
        except Exception:
            kind = None
        try:
            text = data.decode('utf-8')
        except Exception:
            # try latin-1
            text = data.decode('latin1', errors='ignore')
    else:
        return jsonify({"error":"No text or file provided"}), 400

    windows = split_into_windows(text, sentences_per_window=sentences_per_window)
    if not windows:
        return jsonify({"error":"No valid windows extracted from text"}), 400
    results = classify_windows(windows)
    flagged = [r for r in results if r['ai_prob']>=0.5]
    percent_ai = len(flagged)/len(results) * 100.0

    # create report
    report_name = f"report_{abs(hash(text))% (10**8)}.pdf"
    os.makedirs("reports", exist_ok=True)
    report_path = os.path.join("reports", report_name)
    make_pdf_report(f"AI-detection report for {filename}", text, results, report_path)

    # Prepare highlight info: return indices and probs
    highlights = [{"window_index": idx, "start_sent": w['start_sent'], "end_sent": w['end_sent'], "ai_prob": w['ai_prob']} for idx,w in enumerate(results)]

    return jsonify({
        "filename": filename,
        "num_windows": len(results),
        "percent_ai": percent_ai,
        "highlights": highlights,
        "report_file": f"/download_report/{report_name}"
    })

@app.route("/download_report/<name>", methods=["GET"])
def download_report(name):
    path = os.path.join("reports", name)
    if not os.path.exists(path):
        return "not found", 404
    return send_file(path, as_attachment=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
