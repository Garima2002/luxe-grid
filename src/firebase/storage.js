// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Cloudinary — Image Upload (FREE, no credit card)
//
//  Your details:
//  Cloud Name:    dj0ydfpu6
//  Upload Preset: luxegrid-upload
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CLOUD_NAME    = 'dj0ydfpu6';
const UPLOAD_PRESET = 'luxegrid-upload';
const UPLOAD_URL    = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Upload a single image File to Cloudinary.
 * Returns a Promise that resolves to the public image URL.
 * Calls onProgress(percent) during upload.
 */
export function uploadImage(file, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file',           file);
    formData.append('upload_preset',  UPLOAD_PRESET);
    formData.append('folder',         'luxegrid-products');

    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener('progress', e => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        resolve(res.secure_url); // HTTPS image URL
      } else {
        reject(new Error('Upload failed: ' + xhr.statusText));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')));

    xhr.open('POST', UPLOAD_URL);
    xhr.send(formData);
  });
}

/**
 * Upload multiple images in parallel.
 * Returns array of URLs in the same order as files.
 */
export async function uploadImages(files, onProgress) {
  const total       = files.length;
  const progresses  = new Array(total).fill(0);

  const urls = await Promise.all(
    files.map((file, i) =>
      uploadImage(file, pct => {
        progresses[i] = pct;
        const overall = Math.round(progresses.reduce((a, b) => a + b, 0) / total);
        if (onProgress) onProgress(overall);
      })
    )
  );
  return urls;
}
