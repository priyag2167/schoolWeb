import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Popup from '@/components/Popup';

export default function AddSchoolPage() {
  const router = useRouter();
  const [popupOpen, setPopupOpen] = useState(false);
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email_id: '',
      contact: '',
      address: '',
      city: '',
      state: '',
      image: null,
    },
  });

  const imageFile = watch('image');

  async function onSubmit(values) {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email_id', values.email_id);
    formData.append('contact', values.contact);
    formData.append('address', values.address);
    formData.append('city', values.city);
    formData.append('state', values.state);
    if (values.image && values.image[0]) formData.append('image', values.image[0]);

    const res = await fetch('/api/addSchool', { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) {
      return alert(data.message || 'Failed to add school');
    }
    reset();
    setPopupOpen(true);
  }

  return (
    <div className="page">
      <Popup
        open={popupOpen}
        title="School Added"
        description="The school has been added successfully."
        confirmLabel="Go to Schools"
        onConfirm={() => { setPopupOpen(false); router.push('/'); }}
      />
      <div className="card">
        <div className="header">
          <div className="topbar">
            <h1 className="title"><span className="icon">🏫</span><span className="grad">Add School</span></h1>
            <button type="button" className="backBtn" aria-label="Back" onClick={() => router.push('/')}>Back</button>
          </div>
          <p className="subtitle">Fill the details to add a new school.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="grid two-col">
            <div className="field">
              <label className="label">School Name</label>
              <input
                className="input"
                placeholder="e.g., Springfield High"
                {...register('name', { required: 'School name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
              />
              {errors.name && <div className="error">{errors.name.message}</div>}
            </div>

            <div className="field">
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="admin@school.com"
                {...register('email_id', {
                  required: 'Email is required',
                  pattern: {
                    value: /^(?:[a-zA-Z0-9_'^&\/+-])+(?:\.(?:[a-zA-Z0-9_'^&\/+-])+)*@(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/,
                    message: 'Enter a valid email',
                  },
                })}
              />
              {errors.email_id && <div className="error">{errors.email_id.message}</div>}
            </div>
          </div>

          <div className="grid two-col">
            <div className="field">
              <label className="label">Contact</label>
              <input
                className="input"
                placeholder="e.g., 9876543210"
                {...register('contact', {
                  required: 'Contact is required',
                  pattern: { value: /^\d{7,15}$/, message: 'Enter 7-15 digits' },
                })}
              />
              {errors.contact && <div className="error">{errors.contact.message}</div>}
            </div>

            <div className="field">
              <label className="label">City</label>
              <input
                className="input"
                placeholder="e.g., San Jose"
                {...register('city', { required: 'City is required', minLength: { value: 2, message: 'City must be at least 2 characters' } })}
              />
              {errors.city && <div className="error">{errors.city.message}</div>}
            </div>
          </div>

          <div className="field">
            <label className="label">Address</label>
            <textarea
              rows={3}
              className="input textarea"
              placeholder="Street, City, State, ZIP"
              {...register('address', { required: 'Address is required', minLength: { value: 6, message: 'Address must be at least 6 characters' } })}
            />
            {errors.address && <div className="error">{errors.address.message}</div>}
          </div>

          <div className="grid two-col">
            <div className="field">
              <label className="label">State</label>
              <input
                className="input"
                placeholder="e.g., California"
                {...register('state', { required: 'State is required', minLength: { value: 2, message: 'State must be at least 2 characters' } })}
              />
              {errors.state && <div className="error">{errors.state.message}</div>}
            </div>

            <div className="field">
              <label className="label">School Image</label>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="input file"
                {...register('image', { required: 'Image is required' })}
              />
              {errors.image && <div className="error">{errors.image.message}</div>}
            </div>
          </div>

          {imageFile && imageFile[0] && (
            <div className="preview-wrap">
              <img alt="Preview" src={URL.createObjectURL(imageFile[0])} className="preview" />
            </div>
          )}

          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting…' : 'Add School'}
          </button>
        </form>
      </div>

      <style jsx>{`
        :global(html), :global(body), :global(#__next) { height: 100%; }
        .page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(16px, 4vw, 32px);
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
          background: radial-gradient(60% 80% at 20% 10%, #e0e7ff 0%, transparent 60%),
                      radial-gradient(60% 80% at 80% 0%, #ccfbf1 0%, transparent 60%),
                      linear-gradient(135deg, #f8fafc, #eef2ff);
          background-size: 200% 200%;
          animation: bgShift 12s ease-in-out infinite;
        }

        @keyframes bgShift {
          0% { background-position: 0% 0%, 100% 0%, 0% 0%; }
          50% { background-position: 50% 50%, 50% 0%, 50% 50%; }
          100% { background-position: 0% 0%, 100% 0%, 0% 0%; }
        }

        .card {
          width: 100%;
          max-width: 760px;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: saturate(140%) blur(10px);
          border: 1px solid rgba(99, 102, 241, 0.15);
          border-radius: 16px;
          padding: 22px;
          min-height: clamp(560px, 72vh, 820px);
          box-shadow: 0 20px 40px rgba(2, 6, 23, 0.12);
          animation: floatIn 500ms ease-out both;
        }

        @keyframes floatIn {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .header { margin-bottom: 12px; }
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
        .backBtn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 14px;
          border-radius: 12px;
          border: none;
          color: #ffffff;
          font-weight: 700;
          cursor: pointer;
          background: linear-gradient(135deg, #6366f1, #22d3ee);
          box-shadow: 0 12px 28px rgba(99, 102, 241, 0.35);
          transition: transform 140ms ease, filter 140ms ease, box-shadow 140ms ease;
          white-space: nowrap;
        }
        .backBtn:hover { transform: translateY(-1px); filter: brightness(1.04); }
        .backBtn:active { transform: translateY(0); filter: brightness(0.98); }
        .subtitle { margin: 0 0 16px; color: #64748b; }

        .form { display: grid; gap: 18px; }
        @media (min-width: 768px) { .form { gap: 22px; } }
        .grid { display: grid; gap: 16px; align-items: start; }
        .two-col { grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 768px) { .two-col { grid-template-columns: 1fr 1fr; gap: 18px 24px; } }

        .field { display: flex; flex-direction: column; }
        .label { font-weight: 600; color: #1f2937; margin-bottom: 8px; }

        .input {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          color: #0f172a;
          border-radius: 12px;
          padding: 14px 16px;
          transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease, transform 120ms ease;
        }
        .input:focus {
          outline: none;
          background: #ffffff;
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.16);
        }
        .input:hover { transform: translateY(-1px); }
        .textarea { resize: vertical; }
        .file { padding: 10px 12px; min-height: 48px; }

        .error { color: #dc2626; font-size: 13px; margin-top: 6px; }

        .preview-wrap { margin-top: 6px; }
        .preview {
          width: 100%;
          height: 220px;
          object-fit: cover;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: #f3f4f6;
        }

        .btn {
          margin-top: 12px;
          width: 100%;
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
        .btn[disabled] { opacity: 0.7; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
