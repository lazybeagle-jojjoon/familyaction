export interface FamilyPhoto {
  id: string;
  name: string;
  /** 축소·압축한 JPEG data URL */
  image: string;
}

const PHOTO_KEY = "poolvilla_family_photos";
/** localStorage는 보통 5MB 남짓이라 장수와 해상도를 함께 제한합니다. */
export const PHOTO_LIMIT = 40;
const MAX_EDGE = 480;
const JPEG_QUALITY = 0.72;

export function loadPhotos(): FamilyPhoto[] {
  try {
    const raw = JSON.parse(localStorage.getItem(PHOTO_KEY) ?? "[]");
    if (!Array.isArray(raw)) return [];
    return raw.filter(
      (photo): photo is FamilyPhoto =>
        Boolean(photo) &&
        typeof photo.id === "string" &&
        typeof photo.name === "string" &&
        typeof photo.image === "string",
    );
  } catch {
    return [];
  }
}

export function savePhotos(photos: FamilyPhoto[]) {
  localStorage.setItem(PHOTO_KEY, JSON.stringify(photos));
}

export function removePhoto(id: string) {
  savePhotos(loadPhotos().filter((photo) => photo.id !== id));
}

/**
 * 사진을 480px 이하로 줄이고 JPEG로 다시 인코딩합니다.
 * 원본을 그대로 넣으면 몇 장 만에 브라우저 저장 용량이 꽉 찹니다.
 */
export function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_EDGE / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));

      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("이 브라우저에서는 사진을 줄일 수 없어요"));
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("사진을 읽지 못했어요"));
    };

    image.src = url;
  });
}

export function addPhoto(name: string, image: string) {
  const photos = loadPhotos();
  if (photos.length >= PHOTO_LIMIT) {
    throw new Error(`사진은 ${PHOTO_LIMIT}장까지 넣을 수 있어요`);
  }

  const next = [...photos, { id: crypto.randomUUID(), name: name.trim(), image }];

  try {
    savePhotos(next);
  } catch {
    throw new Error("저장 공간이 부족해요. 사진을 몇 장 지우고 다시 시도해주세요");
  }

  return next;
}
