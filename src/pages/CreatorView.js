import React, { useState } from 'react';
import './CreatorView.css';

const sasToken = '?sv=2024-11-04&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2025-06-04T21:41:57Z&st=2025-04-30T13:41:57Z&spr=https&sig=N4ayzcsA6HreQViX8GkcVty4IH%2B98JCe%2BZUWX3Vwrws%3D';
const uploadBaseUrl = 'https://myfirststaticwebapp1.blob.core.windows.net/videos';

const CreatorView = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [people, setPeople] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const fileExtension = file.name.split('.').pop();
    const timestamp = Date.now();
    const baseFileName = `${timestamp}`;
    const blobFileName = `${baseFileName}.${fileExtension}`;
    const uploadUrl = `${uploadBaseUrl}/${blobFileName}${sasToken}`;
    const metadataUrl = `${uploadBaseUrl}/${baseFileName}.json${sasToken}`;

    try {
      // Upload media file
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'x-ms-blob-type': 'BlockBlob',
          'Content-Type': file.type,
        },
        body: file,
      });

      // Upload metadata
      const metadata = {
        title,
        caption,
        location,
        people,
        fileType: file.type.startsWith('image/') ? 'image' : 'video',
      };

      const metadataBlob = new Blob([JSON.stringify(metadata)], {
        type: 'application/json',
      });

      await fetch(metadataUrl, {
        method: 'PUT',
        headers: {
          'x-ms-blob-type': 'BlockBlob',
          'Content-Type': 'application/json',
        },
        body: metadataBlob,
      });

      setUploadStatus('✅ Upload successful!');
      // Reset form
      setFile(null);
      setTitle('');
      setCaption('');
      setLocation('');
      setPeople('');
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('❌ Upload failed. Please try again.');
    }
  };

  return (
    <div className="creator-container">
      <h1>Creator View - Upload Video or Image</h1>
      <form onSubmit={handleUpload} className="creator-form">
        <input
          type="file"
          accept="video/mp4,image/png,image/jpeg,image/jpg"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />

        {file && (
          <div className="media-preview">
            {file.type.startsWith('image/') ? (
              <img src={URL.createObjectURL(file)} alt="Preview" width="300" />
            ) : (
              <video width="300" controls>
                <source src={URL.createObjectURL(file)} type={file.type} />
              </video>
            )}
          </div>
        )}

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="People Present"
          value={people}
          onChange={(e) => setPeople(e.target.value)}
        />
        <button type="submit">Upload</button>
      </form>

      {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
    </div>
  );
};

export default CreatorView;
