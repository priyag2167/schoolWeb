import React from 'react';

export default function Popup({ open, title = 'Success', description = '', confirmLabel = 'OK', onConfirm }) {
  if (!open) return null;

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="popup-title">
      <div className="modal">
        <div className="header">
          <div className="icon">✓</div>
          <h2 id="popup-title" className="title">{title}</h2>
        </div>
        {description && <p className="desc">{description}</p>}

        <div className="actions">
          <button type="button" className="btn" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>

      <style jsx>{`
        .overlay {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          background: rgba(2, 6, 23, 0.45);
          backdrop-filter: saturate(140%) blur(4px);
          z-index: 50;
        }
        .modal {
          width: min(92vw, 520px);
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(99, 102, 241, 0.18);
          border-radius: 16px;
          padding: 18px;
          box-shadow: 0 24px 56px rgba(2, 6, 23, 0.22);
          animation: popIn 180ms ease-out both;
        }
        @keyframes popIn {
          from { opacity: 0; transform: translateY(6px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #22d3ee);
          color: #ffffff;
          font-weight: 900;
          box-shadow: 0 10px 22px rgba(99,102,241,0.35);
        }
        .title {
          margin: 0;
          font-size: clamp(18px, 2.6vw, 22px);
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #0f172a;
        }
        .desc {
          margin: 6px 0 14px;
          color: #475569;
          line-height: 1.5;
        }
        .actions { display: flex; justify-content: flex-end; }
        .btn {
          border: none;
          color: white;
          font-weight: 700;
          padding: 12px 14px;
          border-radius: 12px;
          cursor: pointer;
          background: linear-gradient(135deg, #6366f1, #22d3ee);
          box-shadow: 0 12px 28px rgba(99, 102, 241, 0.35);
          transition: transform 140ms ease, filter 140ms ease, box-shadow 140ms ease;
        }
        .btn:hover { transform: translateY(-1px); filter: brightness(1.04); }
        .btn:active { transform: translateY(0); filter: brightness(0.98); }
      `}</style>
    </div>
  );
}

