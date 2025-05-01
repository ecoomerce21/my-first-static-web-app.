import React, { useEffect, useState } from 'react';
import './ConsumerView.css';

const ConsumerView = () => {
  const [videoUrls, setVideoUrls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [comments, setComments] = useState({});
  const [ratings, setRatings] = useState({});

  const blobListUrl = 'https://myfirststaticwebapp1.blob.core.windows.net/videos?restype=container&comp=list';

  useEffect(() => {
    fetch(blobListUrl)
      .then((response) => response.text())
      .then((xmlText) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, 'application/xml');
        const blobs = xml.getElementsByTagName('Blob');

        const urls = Array.from(blobs).map((blob) => {
          const name = blob.getElementsByTagName('Name')[0].textContent;
          return `https://myfirststaticwebapp1.blob.core.windows.net/videos/${name}`;
        });

        setVideoUrls(urls);
      })
      .catch((error) => {
        console.error('Failed to load videos:', error);
      });
  }, []);

  const handleCommentChange = (url, comment) => {
    setComments(prev => ({ ...prev, [url]: comment }));
  };

  const handleCommentSubmit = (url) => {
    alert(`Comment submitted for ${url}: ${comments[url]}`);
  };

  const handleRating = (url, rating) => {
    setRatings(prev => ({ ...prev, [url]: rating }));
  };

  const filteredVideos = videoUrls.filter(url =>
    url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="consumer-container">
      <h1>Consumer View - Watch Videos</h1>

      <input
        type="text"
        placeholder="Search videos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-box"
      />

      <div className="video-gallery">
        {filteredVideos.map((url, index) => (
          <div key={index} className="video-card">
            <video controls width="320" height="240">
              <source src={url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleRating(url, star)}
                  style={{
                    cursor: 'pointer',
                    color: ratings[url] >= star ? 'gold' : 'gray',
                    fontSize: '1.5rem',
                  }}
                >
                  ★
                </span>
              ))}
            </div>

            <div className="comment-section">
              <input
                type="text"
                placeholder="Write a comment..."
                value={comments[url] || ''}
                onChange={(e) => handleCommentChange(url, e.target.value)}
              />
              <button onClick={() => handleCommentSubmit(url)}>Submit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsumerView;
