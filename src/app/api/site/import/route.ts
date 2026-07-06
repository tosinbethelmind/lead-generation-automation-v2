import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { exec } from "child_process";
import { tmpdir } from "os";

/**
 * API route to import an existing website build.
 * Supports either a git repository URL or an uploaded archive file (zip/tar.gz).
 * For this demo we provide placeholder logic: it acknowledges the request and
 * returns basic info. Real implementation would clone the repo or extract the
 * archive into the workspace and then trigger domain/hosting processing.
 */
export async function POST(req: Request) {
  try {
    // FormData can contain a gitUrl field and/or a file field.
    const formData = await req.formData();
    const gitUrl = formData.get("gitUrl") as string | null;
    const file = formData.get("file") as File | null;

    if (!gitUrl && !file) {
      return NextResponse.json({ error: "Provide a gitUrl or upload a file." }, { status: 400 });
    }

    // Placeholder handling – just report what was received.
    if (gitUrl) {
      // In a real implementation you might `git clone` into a temp directory.
      return NextResponse.json({ message: "Git repository received.", gitUrl });
    }
    if (file) {
      // In a real implementation you would stream the file to disk and extract.
      return NextResponse.json({ message: "File uploaded.", filename: file.name, size: file.size });
    }
  } catch (err) {
    return NextResponse.json({ error: "Import failed." }, { status: 500 });
  }
}
