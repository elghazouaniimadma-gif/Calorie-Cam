import { useState, useRef } from 'react';
import Head from 'next/head';
//import '../styles/globals.css';

export default function Home() {
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    setResult(null);
    setError(null);
    setMimeType(file.type || 'image/jpeg');
    const url = URL.createObjectURL(file);
    setImage(url);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result.split(',')[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!imageBase64) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mimeType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setImageBase64(null);
    setResult(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const confidenceColor = {
    high: '#6db87a',
    medium: '#e8a830',
    low: '#d47a6b',
  };

  return (
    <>
      <Head>
        <title>CalorieCam</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CalorieCam" />
        <meta name="theme-color" content="#0f0d0b" />
      </Head>

      <div style={s.page}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.logoMark}>◎</div>
          <h1 style={s.title}>CalorieCam</h1>
          <p style={s.subtitle}>Point. Shoot. Know.</p>
        </div>

        {/* Main card */}
        <div style={s.card}>
          {!image ? (
            /* Upload zone */
            <div
              style={s.uploadZone}
              onClick={() => fileRef.current?.click()}
            >
              <div style={s.uploadIcon}>🍽</div>
              <p style={s.uploadText}>Tap to photograph your dish</p>
              <p style={s.uploadHint}>Camera or photo library</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>
          ) : (
            /* Image preview */
            <div style={s.previewWrap}>
              <img src={image} alt="dish" style={s.preview} />
              <button style={s.retakeBtn} onClick={reset}>✕ Retake</button>
            </div>
          )}

          {/* Analyze button */}
          {image && !result && (
            <button
              style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
              onClick={analyze}
              disabled={loading}
            >
              {loading ? (
                <span style={s.loadingRow}>
                  <span style={s.spinner} /> Analyzing…
                </span>
              ) : '🔍 Analyze Dish'}
            </button>
          )}

          {/* Error */}
          {error && (
            <div style={s.errorBox}>
              ⚠️ {error}
            </div>
          )}

          {/* Results */}
          {result && (
            <div style={s.results}>
              {/* Dish name */}
              <div style={s.dishRow}>
                <h2 style={s.dishName}>{result.dish}</h2>
                <div style={s.badges}>
                  <span style={s.portionBadge}>{result.portion}</span>
                  <span style={{
                    ...s.confBadge,
                    background: confidenceColor[result.confidence] + '22',
                    color: confidenceColor[result.confidence],
                    borderColor: confidenceColor[result.confidence] + '55',
                  }}>
                    {result.confidence} confidence
                  </span>
                </div>
              </div>

              {/* Calories — hero number */}
              <div style={s.calorieBox}>
                <div style={s.calNum}>{result.calories}</div>
                <div style={s.calLabel}>kcal</div>
              </div>

              {/* Macros grid */}
              <div style={s.macroGrid}>
                <MacroCard label="Protein" value={result.protein} unit="g" color="#6db87a" />
                <MacroCard label="Carbs" value={result.carbs} unit="g" color="#6ba8d4" />
                <MacroCard label="Fat" value={result.fat} unit="g" color="#d47a6b" />
                <MacroCard label="Fiber" value={result.fiber} unit="g" color="#a87db8" />
              </div>

              {/* Notes */}
              {result.notes && (
                <div style={s.notes}>
                  <span style={s.notesIcon}>💡</span> {result.notes}
                </div>
              )}

              {/* New photo button */}
              <button style={s.newBtn} onClick={reset}>
                📸 New Photo
              </button>
            </div>
          )}
        </div>

        <p style={s.footer}>Estimates only · Not medical advice</p>
      </div>
    </>
  );
}

function MacroCard({ label, value, unit, color }) {
  return (
    <div style={{ ...s.macroCard, borderColor: color + '33' }}>
      <div style={{ ...s.macroVal, color }}>{value}<span style={s.macroUnit}>{unit}</span></div>
      <div style={s.macroLabel}>{label}</div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    padding: '24px 16px 40px',
    maxWidth: 480,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  header: {
    textAlign: 'center',
    paddingTop: 16,
  },
  logoMark: {
    fontSize: 32,
    color: '#e8a830',
    marginBottom: 4,
    display: 'block',
  },
  title: {
    fontSize: 38,
    fontWeight: 700,
    letterSpacing: '-0.5px',
    color: '#f0ead8',
    fontFamily: "'Cormorant Garamond', serif",
  },
  subtitle: {
    color: '#8a7e68',
    fontSize: 13,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  card: {
    background: '#1a1712',
    border: '1px solid #2e2a22',
    borderRadius: 20,
    overflow: 'hidden',
  },
  uploadZone: {
    padding: '52px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    borderBottom: '1px solid #2e2a22',
  },
  uploadIcon: {
    fontSize: 52,
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 17,
    fontWeight: 500,
    color: '#f0ead8',
  },
  uploadHint: {
    fontSize: 13,
    color: '#8a7e68',
  },
  previewWrap: {
    position: 'relative',
  },
  preview: {
    width: '100%',
    display: 'block',
    maxHeight: 340,
    objectFit: 'cover',
  },
  retakeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    background: 'rgba(0,0,0,0.6)',
    color: '#f0ead8',
    border: 'none',
    borderRadius: 20,
    padding: '6px 14px',
    fontSize: 13,
    cursor: 'pointer',
    backdropFilter: 'blur(4px)',
  },
  btn: {
    width: '100%',
    background: '#e8a830',
    color: '#0f0d0b',
    border: 'none',
    padding: '16px',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: '0.02em',
    transition: 'opacity 0.2s',
  },
  loadingRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  spinner: {
    display: 'inline-block',
    width: 16,
    height: 16,
    border: '2px solid #0f0d0b44',
    borderTop: '2px solid #0f0d0b',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  errorBox: {
    padding: '14px 20px',
    background: '#d47a6b22',
    borderTop: '1px solid #d47a6b44',
    color: '#d47a6b',
    fontSize: 14,
  },
  results: {
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  dishRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  dishName: {
    fontSize: 28,
    fontWeight: 600,
    color: '#f0ead8',
    fontFamily: "'Cormorant Garamond', serif",
    lineHeight: 1.1,
  },
  badges: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  portionBadge: {
    background: '#2e2a22',
    color: '#8a7e68',
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 12,
    border: '1px solid #3a3528',
  },
  confBadge: {
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 12,
    border: '1px solid',
  },
  calorieBox: {
    background: '#242018',
    border: '1px solid #2e2a22',
    borderRadius: 16,
    padding: '24px',
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 8,
  },
  calNum: {
    fontSize: 72,
    fontWeight: 700,
    color: '#e8a830',
    fontFamily: "'Cormorant Garamond', serif",
    lineHeight: 1,
  },
  calLabel: {
    fontSize: 20,
    color: '#8a7e68',
    fontFamily: "'Cormorant Garamond', serif",
  },
  macroGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },
  macroCard: {
    background: '#242018',
    border: '1px solid',
    borderRadius: 14,
    padding: '14px 16px',
  },
  macroVal: {
    fontSize: 26,
    fontWeight: 600,
    fontFamily: "'Cormorant Garamond', serif",
    lineHeight: 1.1,
  },
  macroUnit: {
    fontSize: 14,
    marginLeft: 2,
    opacity: 0.7,
  },
  macroLabel: {
    fontSize: 12,
    color: '#8a7e68',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  notes: {
    background: '#242018',
    border: '1px solid #2e2a22',
    borderRadius: 12,
    padding: '14px 16px',
    fontSize: 13,
    color: '#8a7e68',
    lineHeight: 1.6,
  },
  notesIcon: {
    marginRight: 4,
  },
  newBtn: {
    width: '100%',
    background: 'transparent',
    color: '#e8a830',
    border: '1px solid #e8a83055',
    borderRadius: 12,
    padding: '14px',
    fontSize: 15,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: '#3a3528',
    letterSpacing: '0.05em',
  },
};
