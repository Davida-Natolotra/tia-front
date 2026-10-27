import { NO_PHOTO_URL } from './mediaUrl';

// Shrinks a picked photo before upload and hands the form a ready-to-send file.
//
// - The upload is always a real JPEG named "<name>.jpg". The backend checks the file
//   extension, so names like "IMG_1234.HEIC" or "photo.jfif" must not reach it as-is.
// - setStateFile, setChange and setStateURI are only called once the file is ready, so a
//   form saved in the meantime never sends an empty value in place of the file.
// - Problems (not an image, a format this browser can't open such as HEIC on Chrome)
//   are reported through onError instead of failing silently.

const MAX_WIDTH = 720;
const MAX_HEIGHT = 500;
const JPEG_QUALITY = 0.92;

export const IMAGE_ERRORS = {
  notImage: 'Le fichier choisi n’est pas une image. Choisissez une photo (JPG, PNG…).',
  unreadable: 'Impossible de lire cette image (format HEIC ou fichier endommagé ?). Choisissez une photo JPG ou PNG.'
};

const IMAGE_NAME = /\.(jpe?g|jfif|png|gif|webp|bmp|heic|heif|avif)$/i;
const isImage = (file) => (file.type ? file.type.startsWith('image/') : IMAGE_NAME.test(file.name));

const jpegName = (name) => {
  const stem = (name || '').replace(/\.[^./\\]*$/, '').trim();
  return `${stem || 'photo'}.jpg`;
};

const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(IMAGE_ERRORS.unreadable));
    };
    img.src = url;
  });

// Resolves to { file, preview }: a JPEG File no larger than MAX_WIDTH x MAX_HEIGHT and a data URL to show.
export async function compressImage(file) {
  const img = await loadImage(file);
  const scale = Math.min(1, MAX_WIDTH / img.naturalWidth, MAX_HEIGHT / img.naturalHeight);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
  const context = canvas.getContext('2d');
  // JPEG has no transparency: paint transparent PNG areas white instead of black
  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY));
  if (!blob) throw new Error(IMAGE_ERRORS.unreadable);
  return {
    file: new File([blob], jpegName(file.name), { type: 'image/jpeg', lastModified: Date.now() }),
    preview: canvas.toDataURL('image/jpeg', JPEG_QUALITY)
  };
}

// onChange handler for <input type="file">.
// allowNonImage: send non-image files (e.g. a PDF receipt) unchanged instead of rejecting them;
// they get the "no photo" placeholder as preview.
export const fileChangedHandler = ({ event, setStateFile, setStateURI, setChange, onError, allowNonImage = false }) => {
  const input = event.target;
  const file = input.files && input.files[0];
  // Let the same file be picked again later (onChange does not fire for an unchanged value)
  input.value = '';
  if (!file) return;

  const report = (message) => {
    if (onError) onError(message);
    else console.error(message);
  };

  if (!isImage(file)) {
    if (allowNonImage) {
      setStateFile(file);
      setChange(true);
      setStateURI(NO_PHOTO_URL);
    } else {
      report(IMAGE_ERRORS.notImage);
    }
    return;
  }

  compressImage(file)
    .then(({ file: jpeg, preview }) => {
      // Mark the change before setting the preview: the forms only show a new preview once changed is true
      setStateFile(jpeg);
      setChange(true);
      setStateURI(preview);
    })
    .catch((error) => report(error.message || IMAGE_ERRORS.unreadable));
};
