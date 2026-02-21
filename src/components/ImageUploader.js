import React, { useRef, useState } from 'react';
import { uploadImages } from '../firebase/storage';
import './ImageUploader.css';

/**
 * ImageUploader — lets the owner pick images from phone/computer.
 * Supports: tap to pick, drag & drop, multiple files, live preview,
 * upload progress bar, and remove individual images.
 *
 * Props:
 *   images   — array of already-uploaded URLs (from parent state)
 *   onChange — called with new array of URLs after upload
 *   showToast — function to show success/error toasts
 */
export default function ImageUploader({ images = [], onChange, showToast }) {
  const inputRef = useRef();
  const [uploading, setUploading]   = useState(false);
  const [progress, setProgress]     = useState(0);
  const [dragging, setDragging]     = useState(false);

  // Handle files selected from input or dropped
  const handleFiles = async (files) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const valid = Array.from(files).filter(f => validTypes.includes(f.type));

    if (!valid.length) {
      showToast('Please pick JPG, PNG, or WEBP images only', 'error');
      return;
    }
    if (valid.length > 5) {
      showToast('Max 5 images at a time', 'error');
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const urls = await uploadImages(valid, setProgress);
      onChange([...images, ...urls]);
      showToast(`${urls.length} image${urls.length > 1 ? 's' : ''} uploaded! ✅`);
    } catch (e) {
      console.error('Image upload error:', e);
      showToast('Upload failed: ' + e.message, 'error');
    } finally {
      // Always reset — button never stays stuck
      setUploading(false);
      setProgress(0);
      // Reset file input so same file can be picked again if needed
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const onDragOver  = e => { e.preventDefault(); setDragging(true);  };
  const onDragLeave = e => { e.preventDefault(); setDragging(false); };
  const onDrop      = e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); };

  return (
    <div className="uploader">

      {/* ── Drop / Tap zone ── */}
      <div
        className={`upload-zone${dragging ? ' dragging' : ''}${uploading ? ' busy' : ''}`}
        onClick={() => !uploading && inputRef.current.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="upload-file-input"
          onChange={e => handleFiles(e.target.files)}
        />

        {uploading ? (
          <div className="upload-progress-wrap">
            <div className="upload-spinner" />
            <p className="upload-status">Uploading… {progress}%</p>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <div className="upload-idle">
            <div className="upload-icon">📷</div>
            <p className="upload-main-text">
              Tap to pick photos
              <span className="upload-desktop-extra"> or drag & drop here</span>
            </p>
            <p className="upload-hint">JPG, PNG, WEBP · Max 5 at a time</p>
          </div>
        )}
      </div>

      {/* ── Preview grid ── */}
      {images.length > 0 && (
        <div className="preview-grid">
          {images.map((url, i) => (
            <div key={i} className="preview-item">
              <img
                src={url}
                alt={`Product ${i + 1}`}
                onError={e => { e.target.src = 'https://placehold.co/100x100/f0e8d8/C6A75E?text=?'; }}
              />
              {/* First image = cover badge */}
              {i === 0 && <span className="cover-badge">Cover</span>}
              <button
                className="remove-img-btn"
                onClick={() => removeImage(i)}
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Add more button */}
          {!uploading && images.length < 8 && (
            <div className="preview-add-more" onClick={() => inputRef.current.click()}>
              <span>+</span>
              <p>Add more</p>
            </div>
          )}
        </div>
      )}

      {images.length > 0 && (
        <p className="upload-tip">💡 First image is shown as the cover. Drag to reorder coming soon.</p>
      )}
    </div>
  );
}
