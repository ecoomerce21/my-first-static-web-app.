import React, { useState } from 'react';
import './CreatorView.css';

const CreatorView = () => {
  const [videoTitle, setVideoTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [peoplePresent, setPeoplePresent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a video file.");
      return;
    }

    const blobName = `${Date.now()}-${selectedFile.name}`;
    const containerName = "videos";

    const sasBaseUrl = "https://myfirststaticwebapp1.blob.core.windows.net";
    const sasToken = "?sv=2024-11-04&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-06-01T08:50:26Z&st=2025-05-01T08:50:26Z&spr=https&sig=Q7XJ7xLhq%2BCZJKaEFGtPPhRbQIal32NQX07w8Okjn2w%3D";

    const videoUploadUrl = `${sasBaseUrl}/${containerName}/${blobName}${sasToken}`;
    const metadataFileName = blobName.replace(/\.[^/.]+$/, "") + ".json";
    const metadataUploadUrl = `${sasBaseUrl}/${containerName}/${metadataFileName}${sasToken}`;

    try {
      // 1. Upload video
      const videoResponse = await fetch(videoUploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });

      if (!videoResponse.ok) {
        const err = await videoResponse.text();
        console.error("Video upload failed:", err);
        alert("❌ Video upload failed.");
        return;
      }

      // 2. Upload metadata JSON
      const metadata = {
        title: videoTitle,
        caption: caption,
        location: location,
        people: peoplePresent,
        videoFile: blobName
      };

      const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });

      const metadataResponse = await fetch(metadataUploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": "application/json",
        },
        body: metadataBlob,
      });

      if (!metadataResponse.ok) {
        const err = await metadataResponse.text();
        console.error("Metadata upload failed:", err);
        alert("❌ Metadata upload failed.");
        return;
      }

      alert("✅ Video and metadata uploaded successfully!");

      // Clear form
      setVideoTitle('');
      setCaption('');
      setLocation('');
      setPeoplePresent('');
      setSelectedFile(null);

    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Upload error.");
    }
  };

  return (
    <div className="creator-container">
      <h1>Creator View</h1>
      <form onSubmit={handleSubmit} className="creator-form">
        <input type="text" placeholder="Video Title" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} required />
        <input type="text" placeholder="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} required />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <input type="text" placeholder="People Present" value={peoplePresent} onChange={(e) => setPeoplePresent(e.target.value)} required />
        <input type="file" accept="video/*" onChange={handleFileChange} required />
        <button type="submit">Upload Video</button>
      </form>
    </div>
  );
};

export default CreatorView;
