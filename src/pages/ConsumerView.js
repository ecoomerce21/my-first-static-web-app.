import React, { useEffect, useState, useCallback } from 'react';
import './ConsumerView.css';

const videoBaseUrl = 'https://myfirststaticwebapp1.blob.core.windows.net/videos';
const feedbackBaseUrl = 'https://myfirststaticwebapp1.blob.core.windows.net/feedback';

// Include your SAS token here
const sasToken = '?sv=2024-11-04&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2025-06-04T21:41:57Z&st=2025-04-30T13:41:57Z&spr=https&sig=N4ayzcsA6HreQViX8GkcVty4IH%2B98JCe%2BZUWX3Vwrws%3D';
const listUrl = `${videoBaseUrl}?restype=container&comp=list`;

const ConsumerView = () => {
  const [mediaUrls, setMediaUrls] = useState([]);
  const [mediaMetadata, setMediaMetadata] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [commentInput, setCommentInput] = useState({});
  const [ratingsInput, setRatingsInput] = useState({});
  const [comments, setComments] = useState({});
  const [ratings, setRatings] = useState({});

  const extractMediaIdFromUrl = (url) => {
    return url.split('/').pop().replace(/\.(mp4|jpg|jpeg|png)$/i, '');
  };

  const fetchFeedbackData = useCallback(async (mediaUrl) => {
    const mediaId = extractMediaIdFromUrl(mediaUrl);
    const feedbackFileName = `${mediaId}.feedback.json`;
    const feedbackUrl = `${feedbackBaseUrl}/${feedbackFileName}${sasToken}`;

    try {
      const response = await fetch(feedbackUrl);
      if (response.ok) {
        const feedbackData = await response.json();
        setComments((prev) => ({ ...prev, [mediaUrl]: feedbackData.comments || [] }));
        setRatings((prev) => ({ ...prev, [mediaUrl]: feedbackData.ratings || [] }));
      } else {
        setComments((prev) => ({ ...prev, [mediaUrl]: [] }));
        setRatings((prev) => ({ ...prev, [mediaUrl]: [] }));
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  }, []);

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
          if (/\.(mp4|jpg|jpeg|png)$/i.test(name)) {
            const mediaUrl = `${videoBaseUrl}/${name}`;
            urls.push(mediaUrl);

            const metadataUrl = mediaUrl.replace(/\.(mp4|jpg|jpeg|png)$/i, '.json');
            try {
              const res = await fetch(metadataUrl);
              if (res.ok) {
                const data = await res.json();
                metadataMap[mediaUrl] = data;
              }
            } catch (err) {
              console.warn(`Metadata fetch failed for ${metadataUrl}`, err);
            }
          }
        }

        setMediaUrls(urls);
        setMediaMetadata(metadataMap);
      })
      .catch((error) => {
        console.error('Failed to load media:', error);
      });
  }, []);

  useEffect(() => {
    mediaUrls.forEach((url) => {
      fetchFeedbackData(url);
    });
  }, [mediaUrls, fetchFeedbackData]);

  const handleRatingClick = (url, rating) => {
    setRatingsInput((prev) => ({ ...prev, [url]: rating }));
  };

  const handleCommentChange = (url, comment) => {
    setCommentInput((prev) => ({ ...prev, [url]: comment }));
  };

  const handleCommentSubmit = async (url) => {
    const mediaId = extractMediaIdFromUrl(url);
    const feedbackFileName = `${mediaId}.feedback.json`;
    const feedbackUrl = `${feedbackBaseUrl}/${feedbackFileName}${sasToken}`;

    const newComment = {
      username: 'currentUser',
      comment: commentInput[url],
      timestamp: new Date().toISOString(),
    };

    const newRating = {
      username: 'currentUser',
      rating: ratingsInput[url] || 0,
    };

    try {
      let feedback = { comments: [], ratings: [] };
      const response = await fetch(feedbackUrl);
      if (response.ok) {
        feedback = await response.json();
      }

      feedback.comments.push(newComment);
      feedback.ratings.push(newRating);

      const updatedBlob = new Blob([JSON.stringify(feedback)], {
        type: 'application/json',
      });

      await fetch(feedbackUrl, {
        method: 'PUT',
        headers: {
          'x-ms-blob-type': 'BlockBlob',
          'Content-Type': 'application/json',
        },
        body: updatedBlob,
      });

      setCommentInput((prev) => ({ ...prev, [url]: '' }));
      fetchFeedbackData(url);
      alert('✅ Feedback submitted successfully!');
    } catch (error) {
      console.error('❌ Failed to submit feedback:', error);
      alert('❌ Failed to submit feedback.');
    }
  };

  const filteredMedia = mediaUrls.filter((url) => {
    const meta = mediaMetadata[url];
    const term = searchTerm.toLowerCase();
    return (
      url.toLowerCase().includes(term) ||
      meta?.title?.toLowerCase().includes(term) ||
      meta?.caption?.toLowerCase().includes(term) ||
      meta?.location?.toLowerCase().includes(term) ||
      meta?.people?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="consumer-container">
      <h1>Consumer View - Watch Media</h1>

      <input
        type="text"
        placeholder="Search videos or images..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-box"
      />

      <div className="video-gallery">
        {filteredMedia.map((url, index) => {
          const meta = mediaMetadata[url] || {};
          const mediaComments = comments[url] || [];
          const mediaRatings = ratings[url] || [];

          return (
            <div key={index} className="video-card">
              {url.endsWith('.mp4') ? (
                <video controls width="320" height="240">
                  <source src={url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img src={url} alt="Uploaded content" width="320" height="240" />
              )}

              <div className="video-info">
                <strong>{meta.title || 'Untitled'}</strong>
                <p><em>{meta.caption}</em></p>
                <p>📍 {meta.location}</p>
                <p>👥 {meta.people}</p>
              </div>

              <p>
                ⭐ Avg Rating: {mediaRatings.length > 0
                  ? (mediaRatings.reduce((sum, r) => sum + r.rating, 0) / mediaRatings.length).toFixed(1)
                  : 'No ratings yet'}
              </p>

              <div className="rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleRatingClick(url, star)}
                    style={{
                      cursor: 'pointer',
                      color: ratingsInput[url] >= star ? 'gold' : 'gray',
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
                  value={commentInput[url] || ''}
                  onChange={(e) => handleCommentChange(url, e.target.value)}
                />
                <button onClick={() => handleCommentSubmit(url)}>Submit</button>
              </div>

              <div className="comments-display">
                <h4>Comments:</h4>
                {mediaComments.length > 0 ? (
                  mediaComments.map((c, i) => (
                    <p key={i}><strong>{c.username}:</strong> {c.comment}</p>
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConsumerView;
