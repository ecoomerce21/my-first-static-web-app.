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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Uploading:', { videoTitle, caption, location, peoplePresent, selectedFile });
    // Later here: Send data to Azure Function or API
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
