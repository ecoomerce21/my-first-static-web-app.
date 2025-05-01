import React, { useState } from 'react';
import './CreatorView.css';

const CreatorView = () => {
  const [videoTitle, setVideoTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [peoplePresent, setPeoplePresent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // ✅ ADD THIS

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

  return (
    <div className="creator-container">
      <h1>Creator View</h1>
      <form onSubmit={handleSubmit} className="creator-form">
        <input type="text" placeholder="Video Title" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} />
        <input type="text" placeholder="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input type="text" placeholder="People Present" value={peoplePresent} onChange={(e) => setPeoplePresent(e.target.value)} />
        <input type="file" accept="video/*" onChange={handleFileChange} />
        <button type="submit">Upload Video</button>
      </form>
    </div>
  );
};

export default CreatorView;
