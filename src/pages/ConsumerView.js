import React, { useEffect, useState } from 'react';
import './ConsumerView.css';

const listUrl = 'https://myfirststaticwebapp1.blob.core.windows.net/videos?restype=container&comp=list';

const ConsumerView = () => {
  const [videoUrls, setVideoUrls] = useState([]);
  const [videoMetadata, setVideoMetadata] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [comments, setComments] = useState({});
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    fetch(listUrl)
      .then((response) => response.text())
      .then(async (xmlText) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, 'application/xml');
        const blobs = xml.getElementsByTagName('Blob');

        const urls = [];
        const metadataMap = {};

        for (let blob of blobs) {
          const name = blob.getElementsByTagName('Name')[0].textContent;
          if (name.endsWith('.mp4')) {
            const videoUrl = `https://myfirststaticwebapp1.blob.core.windows.net/videos/${name}`;
            urls.push(videoUrl);

            const metadataUrl = videoUrl.replace(/\.mp4$/, '.json');
            try {
              const res = await fetch(metadataUrl);
              if (res.ok) {
                const data = await res.json();
                metadataMap[videoUrl] = data;
              }
            } catch (err) {
              console.warn(`Metadata fetch failed for ${metadataUrl}`, err);
            }
          }
        }

        setVideoUrls(urls);
        setVideoMetadata(metadataMap);
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

  const filteredVideos = videoUrls.filter(url => {
    const metadata = videoMetadata[url];
    const search = searchTerm.toLowerCase();
    return (
      url.toLowerCase().includes(search) ||
      metadata?.title?.toLowerCase().includes(search) ||
      metadata?.caption?.toLowerCase().includes(search) ||
      metadata?.location?.toLowerCase().includes(search) ||
      metadata?.people?.toLowerCase().includes(search)
    );
  });

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
        {filteredVideos.map((url, index) => {
          const meta = videoMetadata[url] || {};

          return (
            <div key={index} className="video-card">
              <video controls width="320" height="240">
                <source src={url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <div className="video-info">
                <strong>{meta.title || 'Untitled'}</strong>
                <p><em>{meta.caption}</em></p>
                <p>📍 {meta.location}</p>
                <p>👥 {meta.people}</p>
              </div>

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
          );
        })}
      </div>
    </div>
  );
};

export default ConsumerView;
