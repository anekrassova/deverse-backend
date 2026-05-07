import { v2 as cloudinary } from 'cloudinary';

const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim();

// Используем только CLOUDINARY_URL.
// Важно: в режиме DOCS_ONLY=1 Cloudinary может быть не настроен — тогда просто не ломаем старт приложения.
if (cloudinaryUrl) {
  cloudinary.config({ cloudinary_url: cloudinaryUrl, secure: true });
} else {
  cloudinary.config({ secure: true });
}

export const extractCloudinaryPublicIdFromUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    const pathname = decodeURIComponent(parsed.pathname);
    const uploadIndex = pathname.indexOf('/upload/');
    if (uploadIndex === -1) return null;

    let rest = pathname.slice(uploadIndex + '/upload/'.length);

    // Убираем версию вида v1234567890/
    rest = rest.replace(/^v\d+\//, '');

    // Убираем расширение файла, если оно есть
    const lastDot = rest.lastIndexOf('.');
    if (lastDot !== -1) {
      rest = rest.slice(0, lastDot);
    }

    return rest || null;
  } catch {
    return null;
  }
};

export default cloudinary;
