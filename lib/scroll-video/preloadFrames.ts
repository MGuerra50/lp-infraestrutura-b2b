import { getFramePath, SCROLL_VIDEO } from "@/lib/scroll-video/frames";

const PRELOAD_BATCH_SIZE = 24;

type ProgressCallback = (loadedCount: number, total: number) => void;

function loadFrame(index: number, images: HTMLImageElement[]) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    image.src = getFramePath(index);
    image.decoding = "async";

    const finish = () => {
      images[index] = image;
      resolve();
    };

    image.onload = finish;
    image.onerror = finish;
  });
}

async function preloadAllFrames(onProgress?: ProgressCallback) {
  const images: HTMLImageElement[] = new Array(SCROLL_VIDEO.frameCount);
  loadingImages = images;

  let loadedCount = 0;

  const report = () => {
    onProgress?.(loadedCount, SCROLL_VIDEO.frameCount);
  };

  await loadFrame(0, images);
  loadedCount += 1;
  report();

  for (
    let batchStart = 1;
    batchStart < SCROLL_VIDEO.frameCount;
    batchStart += PRELOAD_BATCH_SIZE
  ) {
    const batchEnd = Math.min(
      batchStart + PRELOAD_BATCH_SIZE,
      SCROLL_VIDEO.frameCount,
    );

    await Promise.all(
      Array.from({ length: batchEnd - batchStart }, (_, offset) =>
        loadFrame(batchStart + offset, images).then(() => {
          loadedCount += 1;
          report();
        }),
      ),
    );
  }

  cachedImages = images;
  return images;
}

let preloadPromise: Promise<HTMLImageElement[]> | null = null;
let cachedImages: HTMLImageElement[] | null = null;
let loadingImages: HTMLImageElement[] | null = null;
const progressListeners = new Set<ProgressCallback>();

function notifyProgress(loaded: number, total: number) {
  progressListeners.forEach((listener) => listener(loaded, total));
}

export function startFramePreload() {
  if (cachedImages) {
    return Promise.resolve(cachedImages);
  }

  if (!preloadPromise) {
    preloadPromise = preloadAllFrames(notifyProgress);
  }

  return preloadPromise;
}

export function subscribeFramePreloadProgress(callback: ProgressCallback) {
  progressListeners.add(callback);

  if (cachedImages) {
    callback(cachedImages.length, SCROLL_VIDEO.frameCount);
  }

  return () => {
    progressListeners.delete(callback);
  };
}

export function getFramesSnapshot() {
  return cachedImages ?? loadingImages;
}

export function isAllFramesReady() {
  return cachedImages !== null;
}
