/**
 * Shrinks an image in the browser before it is uploaded from the admin:
 * long edge capped at 2000px and re-encoded as WebP (~80% quality). Photos straight from a phone or camera
 * (3–8 MB JPEGs) usually end up at 150–400 KB. Anything that isn't a still image (PDFs, GIFs, SVGs), or that
 * wouldn't get smaller, is returned untouched. The site still serves resized AVIF/WebP to visitors on top of this.
 */
const MAX_EDGE = 2000;
const QUALITY = 0.8;

export async function compressImage<T extends File | null | undefined>(file: T): Promise<T> {
    if (!file || !file.type.startsWith("image/") || /gif|svg/.test(file.type)) return file;
    try {
        const bitmap = await createImageBitmap(file);
        const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
        const width = Math.round(bitmap.width * scale);
        const height = Math.round(bitmap.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return file;
        ctx.drawImage(bitmap, 0, 0, width, height);
        bitmap.close();

        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", QUALITY));
        // Some browsers fall back to PNG when WebP encoding isn't supported — keep the original then.
        if (!blob || blob.type !== "image/webp" || blob.size >= file.size) return file;

        const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
        return new File([blob], name, { type: "image/webp", lastModified: Date.now() }) as T;
    } catch {
        return file;
    }
}
