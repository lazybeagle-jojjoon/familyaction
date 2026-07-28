import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import PageShell from "../components/PageShell";
import {
  addPhoto,
  compressImageFile,
  loadPhotos,
  removePhoto,
  PHOTO_LIMIT,
  type FamilyPhoto,
} from "../lib/photoLibrary";

/**
 * 우리 사진 넣기.
 * 흐릿한 이미지 라운드에 가족 사진을 섞으면 어른들이 훨씬 재밌어합니다.
 * 사진은 이 브라우저 안에만 저장되고 어디로도 올라가지 않습니다.
 */
export default function PhotosPage() {
  const [photos, setPhotos] = useState<FamilyPhoto[]>(() => loadPhotos());
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    setBusy(true);
    setError("");

    try {
      let next = photos;
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const image = await compressImageFile(file);
        // 이름을 안 적었으면 파일명에서 확장자를 떼고 씁니다.
        const label = name.trim() || file.name.replace(/\.[^.]+$/, "");
        next = addPhoto(label, image);
      }
      setPhotos(next);
      setName("");
    } catch (addError) {
      setError(addError instanceof Error ? addError.message : "사진을 넣지 못했어요");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <PageShell>
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link to="/lobby" className="rounded-full bg-white px-4 py-2 text-sm font-black shadow">
          ← 로비
        </Link>
        <span className="rounded-full bg-[#FFE66D] px-4 py-2 text-sm font-black">우리 사진</span>
      </div>

      <section className="tv-panel rounded-2xl p-4 sm:p-6">
        <h1 className="text-3xl font-black sm:text-4xl">우리 사진 넣기</h1>
        <p className="mt-2 font-bold leading-7 text-[#4A4A5E]">
          여기 넣은 사진은 <b>흐릿한 이미지</b> 라운드에 섞여 나옵니다. 가족 얼굴, 여행 사진, 우리 집
          강아지처럼 아는 사진일수록 재밌어요. 사진은 이 브라우저에만 저장되고 어디로도 올라가지 않습니다.
          최대 {PHOTO_LIMIT}장까지 넣을 수 있어요.
        </p>

        <div className="mt-6 grid gap-4">
          <label className="grid gap-2">
            <span className="text-lg font-black">정답으로 쓸 이름 (비워두면 파일 이름)</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="예: 할머니, 제주도 바다, 우리 강아지"
              className="min-h-[60px] rounded-xl border-3 border-[#171721] bg-white px-4 text-base font-bold outline-none focus:ring-4 focus:ring-[#4ECDC4]"
            />
          </label>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(event) => void handleFiles(event.target.files)}
          />
          <Button
            tone="blue"
            className="text-xl"
            disabled={busy || photos.length >= PHOTO_LIMIT}
            onClick={() => fileRef.current?.click()}
          >
            {busy ? "사진 넣는 중..." : `사진 고르기 (${photos.length}/${PHOTO_LIMIT})`}
          </Button>

          {error && <p className="rounded-xl bg-[#FFE3E3] p-3 font-black text-[#C92A2A]">{error}</p>}

          {photos.length === 0 ? (
            <p className="rounded-xl bg-[#F6FBFF] p-4 text-center font-bold">
              아직 넣은 사진이 없어요. 사진을 넣지 않아도 라운드는 그대로 돌아갑니다.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo) => (
                <div key={photo.id} className="grid gap-2 rounded-xl border-3 border-[#171721] bg-white p-3">
                  <img
                    src={photo.image}
                    alt={photo.name}
                    className="mx-auto h-32 w-32 rounded-lg object-cover"
                  />
                  <p className="truncate text-center font-black">{photo.name}</p>
                  <Button
                    tone="white"
                    className="min-h-[44px] text-sm"
                    onClick={() => {
                      removePhoto(photo.id);
                      setPhotos(loadPhotos());
                    }}
                  >
                    빼기
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
