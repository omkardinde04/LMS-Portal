// ViewReport.jsx
import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

export default function ViewReport(){
  const { id } = useParams();
  const [report, setReport] = useState(null);

  useEffect(()=>{
    fetch(`/report/${id}`).then(r=>r.json()).then(setReport);
  },[id]);

  if(!report) return <div>Loading...</div>;

  const THRESH=0.6;
  return (
    <div>
      <h2>AI Detection Report</h2>
      <p>File: {report.filename}</p>
      <p>AI % (sentences): {report.ai_percent_by_sentences.toFixed(2)}%</p>
      <div style={{whiteSpace:'pre-wrap', lineHeight:1.6}}>
        {report.detectResult.sentences.map(s => (
          <span key={s.index}
                style={{
                  backgroundColor: s.ai_score >= THRESH ? 'rgba(255,0,0,0.15)' : 'transparent',
                  padding: s.ai_score >= THRESH ? '2px' : undefined,
                  borderRadius: '3px',
                  display: 'inline-block',
                  marginBottom:'4px'
                }}>
            {s.text}
            {s.ai_score >= THRESH && <strong> [{Math.round(s.ai_score*100)}% AI]</strong>}
            {' '}
          </span>
        ))}
      </div>
      <a href={`/report/${report.id}/pdf`} target="_blank" rel="noreferrer">Download PDF</a>
    </div>
  );
}
