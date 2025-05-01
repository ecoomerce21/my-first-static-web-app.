const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedFile) {
    alert("Please select a video file.");
    return;
  }

  const blobName = `${Date.now()}-${selectedFile.name}`;
  const containerName = "videos";

  // SAS URL WITHOUT the container name
  const sasBaseUrl = "https://myfirststaticwebapp1.blob.core.windows.net";
  const sasToken = "?sv=2024-11-04&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-06-01T08:50:26Z&st=2025-05-01T08:50:26Z&spr=https&sig=Q7XJ7xLhq%2BCZJKaEFGtPPhRbQIal32NQX07w8Okjn2w%3D";

  const uploadUrl = `${sasBaseUrl}/${containerName}/${blobName}${sasToken}`;

  try {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": selectedFile.type,
      },
      body: selectedFile,
    });

    if (response.ok) {
      alert("✅ Video uploaded successfully!");
    } else {
      const error = await response.text();
      console.error("Upload failed:", error);
      alert("❌ Upload failed.");
    }
  } catch (err) {
    console.error("Error uploading:", err);
    alert("❌ Upload error.");
  }
};
