# detector/app.py
from flask import Flask, request, jsonify
from transformers import GPT2TokenizerFast, GPT2LMHeadModel
import torch
import nltk
nltk.download('punkt')
from nltk.tokenize import sent_tokenize

app = Flask(__name__)

MODEL_NAME = "gpt2"  # lightweight; swap to a larger LM if you want better estimates
tokenizer = GPT2TokenizerFast.from_pretrained(MODEL_NAME)
model = GPT2LMHeadModel.from_pretrained(MODEL_NAME)
model.eval()
if torch.cuda.is_available():
    model.to('cuda')

def sentence_perplexity(sentence):
    enc = tokenizer.encode(sentence, return_tensors='pt')
    if torch.cuda.is_available():
        enc = enc.to('cuda')
    with torch.no_grad():
        outputs = model(enc, labels=enc)
        neg_log_likelihood = outputs.loss.item() * enc.size(1)
    # rough per-token average loss:
    avg_loss = neg_log_likelihood / enc.size(1)
    # convert to perplexity:
    ppl = torch.exp(torch.tensor(avg_loss)).item()
    return ppl

# Normalize ppl -> ai_score between 0..1 using logistic or min-max with heuristics
def ppl_to_ai_score(ppl, min_ppl=10.0, max_ppl=100.0):
    # Lower perplexity = more predictable = more likely AI-generated.
    # We'll invert and clamp:
    if ppl <= min_ppl:
        return 0.99
    if ppl >= max_ppl:
        return 0.01
    # linear scale inverted:
    score = (max_ppl - ppl) / (max_ppl - min_ppl)
    return float(max(0.0, min(1.0, score)))

@app.route("/detect", methods=["POST"])
def detect():
    data = request.json
    text = data.get("text", "")
    if not text:
        return jsonify({"error":"no text provided"}), 400
    sentences = sent_tokenize(text)
    results = []
    for i, s in enumerate(sentences):
        try:
            ppl = sentence_perplexity(s)
            ai_score = ppl_to_ai_score(ppl)
        except Exception as e:
            ppl = None
            ai_score = 0.0
        results.append({
            "index": i,
            "text": s,
            "ai_score": ai_score,
            "perplexity": ppl
        })
    # Also return summary stats
    avg_score = sum(r["ai_score"] for r in results)/len(results) if results else 0.0
    return jsonify({
        "sentences": results,
        "avg_ai_score": avg_score,
        "sentence_count": len(results)
    })

if __name__ == "__main__":
    app.run(port=5001, debug=False)
