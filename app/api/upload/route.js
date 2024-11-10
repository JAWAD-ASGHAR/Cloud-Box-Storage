import { supabase } from "@/Config/supabaseClient";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), { status: 400 });
    }

    // Generate a unique file name based on the current timestamp
    const fileName = `${file.name.split(".")[0]}-${Date.now()}-${file.name.split(".")[1]}`;

    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from("Cloud App Uploads") // Ensure this bucket name is correct and matches your Supabase setup
      .upload(`public/${fileName}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading file:", error.message);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    console.log("Upload data:", data);

    // Generate the public URL
    const { data: urlData } = supabase.storage
      .from("Cloud App Uploads")
      .getPublicUrl(`public/${fileName}`);

    const publicUrl = urlData?.publicUrl;

    return new Response(JSON.stringify({ url: publicUrl, name: fileName }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Unexpected server error" }), { status: 500 });
  }
}
