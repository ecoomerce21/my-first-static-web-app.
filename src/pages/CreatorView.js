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
    alert("Please select a file.");
    return;
  }

  const blobUrl = "https://myfirststaticwebapp1.blob.core.windows.net/?sv=2024-11-04&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-06-01T12:57:58Z&st=2025-05-01T04:57:58Z&spr=https&sig=qw8BoEGmqfrKS%2B8TJBXYpss5YtyHUgks6%2B2UXq5tqcY%3D";
  const sasToken = "sv=2024-11-04&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-06-01T12:57:58Z&st=2025-05-01T04:57:58Z&spr=https&sig=qw8BoEGmqfrKS%2B8TJBXYpss5YtyHUgks6%2B2UXq5tqcY%3D";
  const fileName = encodeURIComponent(selectedFile.name);

  try {
    const uploadUrl = `${blobUrl}${fileName}?${sasToken}`;
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": selectedFile.type
      },
      body: selectedFile
    });

    if (response.ok) {
      alert("Upload successful!");
    } else {
      console.error("Upload failed", await response.text());
      alert("Upload failed");
    }
  } catch (err) {
    console.error("Upload error:", err);
    alert("Upload failed.");
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
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload Video</button>
      </form>
    </div>
  );
};

export default CreatorView;
