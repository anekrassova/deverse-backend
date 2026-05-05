import { v2 as cloudinary } from 'cloudinary';

// Cloudinary автоматически читает CLOUDINARY_URL из переменных окружения.
// Мы просто вызываем config(), чтобы применить env-настройки.
cloudinary.config({});

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

