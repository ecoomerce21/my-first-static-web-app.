// src/pages/ConsumerView.js
import React, { useEffect, useState } from 'react';
import './ConsumerView.css';

const blobUrl = 'https://myfirststaticwebapp1.blob.core.windows.net/?sv=2024-11-04&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-06-01T08:50:26Z&st=2025-05-01T08:50:26Z&spr=https&sig=Q7XJ7xLhq%2BCZJKaEFGtPPhRbQIal32NQX07w8Okjn2w%3Dhttps://myfirststaticwebapp1.blob.core.windows.net/?sv=2024-11-04&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-06-01T08:50:26Z&st=2025-05-01T08:50:26Z&spr=https&sig=Q7XJ7xLhq%2BCZJKaEFGtPPhRbQIal32NQX07w8Okjn2w%3D';

const ConsumerView = () => {
  const [videoUrls, setVideoUrls] = useState([]);

  useEffect(() => {
    fetch(blobUrl)
      .then((response) => response.text())
      .then((xmlText) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, 'application/xml');
        const blobs = xml.getElementsByTagName('Blob');

        const urls = Array.from(blobs).map((blob) => {
          const name = blob.getElementsByTagName('Name')[0].textContent;
          return `${blobUrl.split('?')[0]}/${name}?${blobUrl.split('?')[1]}`;
        });

        setVideoUrls(urls);
      })
      .catch((error) => {
        console.error('Failed to load videos:', error);
      });
  }, []);

  return (
    <div className="consumer-container">
      <h1>Consumer View - Watch Videos</h1>
      <div className="video-gallery">
        {videoUrls.map((url, index) => (
          <video key={index} controls width="320" height="240">
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ))}
      </div>
    </div>
  );
};

export default ConsumerView;
