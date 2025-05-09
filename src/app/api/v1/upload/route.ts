import { supabase } from "@/lib/db";
import { PDFDocument } from "pdf-lib";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    if (!file) {
      return new Response("No file provided", { status: 400 });
    }

    if (!file.type.startsWith("application/pdf")) {
      return new Response("Invalid file type", { status: 400 });
    }

    const buffer = await file.arrayBuffer();

    const pdfDoc = await PDFDocument.load(buffer);

    const pageCount = pdfDoc.getPageCount();

    const now = new Date();
    const timeStamp = now
      .toISOString()
      .replace(/T/, "_")
      .replace(/:/g, "-")
      .split(".")[0];
    const newFilename = `${timeStamp}-${file.name}`;
    const path = `pdf/${newFilename}`;

    const { data: dataUploadStorage, error: errorUploadStorage } =
      await supabase.storage.from("pdffiles").upload(path, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (errorUploadStorage) {
      return new Response("Supabase upload error", { status: 500 });
    }

    const { data: dataInsert, error: errorInsert } = await supabase
      .from("files")
      .insert({ file_path: path, page: pageCount })
      .select()
      .single();

    if (errorInsert) {
      return new Response("Supabase insert error", { status: 500 });
    }

    return new Response(
      JSON.stringify({
        message: "File uploaded successfully",
        storage: dataUploadStorage,
        data: dataInsert,
        pageCount: pageCount,
        filePath: path,
      }),
      { status: 200 }
    );
  } catch (_error) {
    return new Response("Internal server error", { status: 500 });
  }
}
