/**
 * Client-side image compression using Canvas API.
 * Compresses images before upload to reduce file size and speed up transfers.
 * No external dependencies needed.
 */

interface CompressOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number; // 0-1, default 0.8
    mimeType?: string; // output format, default image/webp
}

const DEFAULT_OPTIONS: Required<CompressOptions> = {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    mimeType: "image/webp",
};

/**
 * Compress an image file before upload.
 * - Resizes to max dimensions while maintaining aspect ratio
 * - Converts to WebP for optimal file size
 * - Returns a new compressed File object
 *
 * Typical results:
 * - 5MB JPEG → ~200-400KB WebP
 * - 2MB PNG → ~100-300KB WebP
 */
export async function compressImage(
    file: File,
    options: CompressOptions = {}
): Promise<File> {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    // Skip compression for SVGs and GIFs (already optimized / animated)
    if (file.type === "image/svg+xml" || file.type === "image/gif") {
        return file;
    }

    // Skip if already small enough (under 500KB)
    if (file.size < 500 * 1024) {
        return file;
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            resolve(file); // Fallback to original if canvas not supported
            return;
        }

        img.onload = () => {
            // Calculate new dimensions maintaining aspect ratio
            let { width, height } = img;

            if (width > opts.maxWidth || height > opts.maxHeight) {
                const ratio = Math.min(
                    opts.maxWidth / width,
                    opts.maxHeight / height
                );
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            canvas.width = width;
            canvas.height = height;

            // Draw with high-quality downscaling
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        resolve(file);
                        return;
                    }

                    // Only use compressed version if it's actually smaller
                    if (blob.size >= file.size) {
                        resolve(file);
                        return;
                    }

                    const compressedFile = new File(
                        [blob],
                        file.name.replace(/\.[^.]+$/, ".webp"),
                        {
                            type: opts.mimeType,
                            lastModified: Date.now(),
                        }
                    );

                    resolve(compressedFile);
                },
                opts.mimeType,
                opts.quality
            );
        };

        img.onerror = () => {
            resolve(file); // Fallback to original on error
        };

        img.src = URL.createObjectURL(file);
    });
}
