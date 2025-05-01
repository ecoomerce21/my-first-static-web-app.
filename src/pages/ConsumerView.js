// src/pages/ConsumerView.js
import React, { useEffect, useState } from 'react';
import './ConsumerView.css';
const blobUrl = 'https://myfirststaticwebapp1.blob.core.windows.net/videos?sp=rl&st=2025-05-01T10:36:43Z&se=2025-06-05T18:36:43Z&spr=https&sv=2024-11-04&sr=c&sig=gA%2FCbZVi2T%2B1f5cpZxxOFSSkKSv8yknrj%2FcQKkBRlYE%3D';


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
        console.log('Fetched video URLs:', urls);

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
