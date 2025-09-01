import React from 'react';

export default function SchoolCard({ school }) {
  const { name, address, city, image } = school || {};

  return (
    <div className="card">
      <div className="imageWrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image || '/file.svg'}
          alt={name || 'School'}
          className="image"
          loading="lazy"
        />
      </div>

      <div className="body">
        <div className="titleRow">
          <h3 className="title">{name || 'Unnamed School'}</h3>
          {city ? <span className="badge">{city}</span> : null}
        </div>
        {address ? <p className="address">{address}</p> : null}
      </div>

      <style jsx>{`
        .card {
          display: flex;
          flex-direction: column;
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(99, 102, 241, 0.15);
          box-shadow: 0 12px 28px rgba(2, 6, 23, 0.08);
          transition: transform 140ms ease, box-shadow 140ms ease, filter 140ms ease;
          backdrop-filter: saturate(140%) blur(8px);
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 36px rgba(2, 6, 23, 0.14);
          filter: brightness(1.02);
        }

        .imageWrap { position: relative; aspect-ratio: 4 / 3; background: #f3f4f6; }
        .image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .body { padding: 12px 14px 16px; display: grid; gap: 8px; }
        .titleRow { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .title {
          margin: 0;
          font-size: clamp(16px, 2.4vw, 18px);
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #0f172a;
          line-height: 1.2;
        }
        .badge {
          white-space: nowrap;
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
          padding: 6px 10px;
          border-radius: 999px;
          background: linear-gradient(135deg, #6366f1, #22d3ee);
          box-shadow: 0 6px 18px rgba(99, 102, 241, 0.35);
        }
        .address {
          margin: 0;
          font-size: 14px;
          color: #334155;
        }
      `}</style>
    </div>
  );
}


