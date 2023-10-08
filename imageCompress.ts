import imageCompression, { Options } from "browser-image-compression";

interface IImageCompressor extends Options {
  file: File;
  callback?: (file: File) => void;
  onProgress?: (progress: number) => void;
}

export const ImageCompressor = async ({
  file,
  callback,
  onProgress,
  ...other
}: IImageCompressor) => {
  const compressedImage = await imageCompression(file, {
    maxSizeMB: 2,
    maxWidthOrHeight: 1080,
    initialQuality: 0.85,
    useWebWorker: true,
    alwaysKeepResolution: true,
    onProgress(progress) {
      onProgress?.(progress);
    },
    ...other,
  });
  const newFile = new File([compressedImage], file.name || "", {
    type: compressedImage.type || "",
  });
  callback?.(newFile);
  return newFile;
};
