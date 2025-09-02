import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const SchoolCard = dynamic(() => import('@/components/SchoolCard'));

export default function ShowSchoolsPage() {
  const router = useRouter();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function fetchSchools() {
      try {
        const res = await fetch('/api/getSchools');
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch');
        if (isMounted) setSchools(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        if (isMounted) setError(err.message || 'Something went wrong');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchSchools();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="page">
      <div className="header">
        <div className="topbar">
          <h1 className="title"><span className="icon">🏫</span><span className="grad">All Schools</span></h1>
          <button type="button" className="addBtn" aria-label="Add School" onClick={() => router.push('/addSchool')}>Add School</button>
        </div>
        <p className="subtitle">Discover schools across cities.</p>
        <div className="searchWrap">
          <div className="search">
            <svg className="searchIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="searchInput"
              placeholder="Search by school name"
              aria-label="Search by school name"
            />
          </div>
        </div>
      </div>

      {loading && <div className="state">Loading schools…</div>}
      {error && !loading && <div className="state error">{error.message}</div>}

      {!loading && !error && (
        (schools.length > 0) ? (
          (() => {
            const trimmed = query.trim().toLowerCase();
            const filtered = trimmed
              ? schools.filter((s) => (s?.name || '').toLowerCase().includes(trimmed))
              : schools;
            return filtered.length > 0 ? (
              <div className="grid">
                {filtered.map((s) => (
                  <SchoolCard key={s.id} school={s} />
                ))}
              </div>
            ) : (
              <div className="state">No results for “{query}”.</div>
            );
          })()
        ) : (
          <div className="state">No schools found.</div>
        )
      )}

      <style jsx>{`
        :global(html), :global(body), :global(#__next) {
          height: 100%;
          scroll-behavior: smooth;
        }
        :global(body) { -webkit-overflow-scrolling: touch; }
        .page {
          min-height: 100vh;
          padding: clamp(16px, 4vw, 32px);
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
          background: radial-gradient(60% 80% at 20% 10%, #e0e7ff 0%, transparent 60%),
                      radial-gradient(60% 80% at 80% 0%, #ccfbf1 0%, transparent 60%),
                      linear-gradient(135deg, #f8fafc, #eef2ff);
          background-size: 200% 200%;
          animation: bgShift 12s ease-in-out infinite;
          will-change: background-position;
        }
        @keyframes bgShift {
          0% { background-position: 0% 0%, 100% 0%, 0% 0%; }
          50% { background-position: 50% 50%, 50% 0%, 50% 50%; }
          100% { background-position: 0% 0%, 100% 0%, 0% 0%; }
        }
        @media (max-width: 640px) { .page { animation: none; } }

        .header { max-width: 1100px; margin: 0 auto 16px; }
        .topbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .title {
          margin: 0 0 6px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: clamp(28px, 4vw, 36px);
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #0f172a;
          position: relative;
        }
        .title::after {
          content: '';
          display: block;
          height: 4px;
          width: 100%;
          max-width: 140px;
          border-radius: 999px;
          margin-top: 6px;
          background: linear-gradient(90deg, #6366f1, #22d3ee);
          opacity: 0.6;
        }
        .icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #22d3ee);
          color: #ffffff;
          box-shadow: 0 10px 22px rgba(99,102,241,0.35);
          transform: translateZ(0);
        }
        .grad {
          background: linear-gradient(90deg, #111827, #4f46e5 40%, #06b6d4 80%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .addBtn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 14px;
          border-radius: 12px;
          border: none;
          color: #ffffff;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          background: linear-gradient(135deg, #6366f1, #22d3ee);
          box-shadow: 0 12px 28px rgba(99, 102, 241, 0.35);
          transition: transform 140ms ease, filter 140ms ease, box-shadow 140ms ease;
          white-space: nowrap;
        }
        .addBtn:hover { transform: translateY(-1px); filter: brightness(1.04); }
        .addBtn:active { transform: translateY(0); filter: brightness(0.98); }
        .subtitle { margin: 0 0 12px; color: #64748b; }

        .searchWrap { margin: 12px 0 6px; }
        .search { position: relative; }
        .searchIcon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; pointer-events: none; }
        .searchInput {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          color: #0f172a;
          border-radius: 12px;
          padding: 12px 14px 12px 40px;
          transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease, transform 120ms ease;
        }
        .searchInput:focus {
          outline: none;
          background: #ffffff;
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.16);
        }
        .searchInput:hover { transform: translateY(-1px); }

        .grid {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 16px;
        }
        @media (min-width: 640px) { .grid { grid-template-columns: repeat(2, 1fr); gap: 18px; } }
        @media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); gap: 22px; } }

        .state { color: #334155; font-weight: 600; text-align: center; padding: 18px; }
        .state.error { color: #dc2626; }
      `}</style>
    </div>
  );
}
