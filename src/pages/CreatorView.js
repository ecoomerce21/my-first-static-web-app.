import React from 'react';
import './CreatorView.css';
const CreatorView = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Creator View</h1>
      <form>
        <input type="text" placeholder="Video Title" style={{ display: 'block', marginBottom: '1rem' }} />
        <input type="text" placeholder="Caption" style={{ display: 'block', marginBottom: '1rem' }} />
        <input type="text" placeholder="Location" style={{ display: 'block', marginBottom: '1rem' }} />
        <input type="text" placeholder="People Present" style={{ display: 'block', marginBottom: '1rem' }} />
        <input type="file" style={{ display: 'block', marginBottom: '1rem' }} />
        <button type="submit">Upload Video</button>
      </form>
    </div>
  );
};

export default CreatorView;
