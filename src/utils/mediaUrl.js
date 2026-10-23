const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const NO_PHOTO_URL = 'https://placehold.jp/24/cccccc/525252/500x500.png?text=Aucune%20photo';

// Turns a file path saved by the backend into a full URL.
// The backend stores either a site path that already includes its prefix
// (e.g. "/api/media/images/60.JPEG"), a full URL, or a bare file name.
// A site path is resolved against the backend's origin, so the "/api"
// prefix of REACT_APP_BACKEND_URL is not added twice.
export function mediaUrl(path, backendUrl = BACKEND_URL) {
  if (!path) return NO_PHOTO_URL;
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith('/')) {
    try {
      return new URL(path, backendUrl).href;
    } catch (error) {
      return `${backendUrl}${path}`;
    }
  }
  return `${backendUrl}/media/${path.replace(/^media\//, '')}`;
}
