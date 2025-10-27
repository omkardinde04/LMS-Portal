// UploadAssignment.jsx
import React, {useState} from 'react';

export default function UploadAssignment() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const upload = async () => {
    if (!file) return alert('Choose file');
    const formData = new FormData();
    formData.append('assignment', file);
    const resp = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData
    });
    const data = await resp.json();
    setResult(data);
  };

  return (
    <div>
      <h2>Upload Assignment</h2>
      <input type="file" onChange={e=>setFile(e.target.files[0])} />
      <button onClick={upload}>Upload & Check AI</button>
      {result && (
        <div>
          <p>Report id: {result.id}</p>
          <p>AI % (sentences): {result.ai_percent_by_sentences?.toFixed(2)}</p>
          <a href={`/report/${result.id}`}>View report (JSON)</a><br/>
          <a href={`/report/${result.id}/pdf`} target="_blank" rel="noreferrer">Download PDF report</a>
        </div>
      )}
    </div>
  );
}
