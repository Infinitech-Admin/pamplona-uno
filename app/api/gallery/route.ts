import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Always read the folder at request time (don't cache an empty result)
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;
// Folders inside /public/images that are NOT albums
const IGNORE_FOLDERS = new Set(["logo", "logos", "icons"]);

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), "public", "images");

    if (!fs.existsSync(imagesDir)) {
      return NextResponse.json({
        success: false,
        message: `Folder not found: ${imagesDir}`,
        albums: [],
      });
    }

    const albums = fs
      .readdirSync(imagesDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !IGNORE_FOLDERS.has(d.name))
      .map((dir) => {
        const files = fs
          .readdirSync(path.join(imagesDir, dir.name))
          .filter((f) => IMAGE_EXT.test(f))
          .sort((a, b) =>
            a.localeCompare(b, undefined, {
              numeric: true,
              sensitivity: "base",
            }),
          );

        return {
          folder: dir.name,
          // public/ is served from the site root, so no "public" in the URL
          images: files.map(
            (f) =>
              `/images/${encodeURIComponent(dir.name)}/${encodeURIComponent(f)}`,
          ),
        };
      })
      .filter((a) => a.images.length > 0);

    return NextResponse.json({ success: true, albums });
  } catch (error) {
    console.error("[api/gallery]", error);
    return NextResponse.json(
      { success: false, message: "Failed to read gallery", albums: [] },
      { status: 500 },
    );
  }
}
