import React, { useEffect, useState, useCallback } from 'react';
import './ConsumerView.css';

const videoBaseUrl = 'https://myfirststaticwebapp1.blob.core.windows.net/videos';
const feedbackBaseUrl = 'https://myfirststaticwebapp1.blob.core.windows.net/feedback';

// Include your SAS token here (from Azure Portal)
const sasToken = '?sp=rcw&st=2025-04-30T12:27:27Z&se=2025-07-04T20:27:27Z&spr=https&sv=2024-11-04&sr=c&sig=hL58oPqdfHIYApoPSOaisf35vk5VCAJRnqFSqlPMouA%3D';

const listUrl = `${videoBaseUrl}?restype=container&comp=list`;

const ConsumerView = () => {
  const [videoUrls, setVideoUrls] = useState([]);
  const [videoMetadata, setVideoMetadata] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [commentInput, setCommentInput] = useState({});
  const [ratingsInput, setRatingsInput] = useState({});
  const [comments, setComments] = useState({});
  const [ratings, setRatings] = useState({});

  const extractVideoIdFromUrl = (url) => {
    return url.split('/').pop().replace('.mp4', '');
  };

  const fetchFeedbackData = useCallback(async (videoUrl) => {
    const videoId = extractVideoIdFromUrl(videoUrl);
    const feedbackFileName = `${videoId}.feedback.json`;
    const feedbackUrl = `${feedbackBaseUrl}/${feedbackFileName}${sasToken}`;

    try {
      const response = await fetch(feedbackUrl);
      if (response.ok) {
        const feedbackData = await response.json();
        setComments((prev) => ({ ...prev, [videoUrl]: feedbackData.comments || [] }));
        setRatings((prev) => ({ ...prev, [videoUrl]: feedbackData.ratings || [] }));
      } else {
        setComments((prev) => ({ ...prev, [videoUrl]: [] }));
        setRatings((prev) => ({ ...prev, [videoUrl]: [] }));
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
          if (name.endsWith('.mp4')) {
            const videoUrl = `${videoBaseUrl}/${name}`;
            urls.push(videoUrl);

            const metadataUrl = videoUrl.replace('.mp4', '.json');
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

  useEffect(() => {
    videoUrls.forEach((url) => {
      fetchFeedbackData(url);
    });
  }, [videoUrls, fetchFeedbackData]);

  const handleRatingClick = (url, rating) => {
    setRatingsInput((prev) => ({ ...prev, [url]: rating }));
  };

  const handleCommentChange = (url, comment) => {
    setCommentInput((prev) => ({ ...prev, [url]: comment }));
  };

  const handleCommentSubmit = async (url) => {
    const videoId = extractVideoIdFromUrl(url);
    const feedbackFileName = `${videoId}.feedback.json`;
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

  const filteredVideos = videoUrls.filter((url) => {
    const meta = videoMetadata[url];
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
          const videoComments = comments[url] || [];
          const videoRatings = ratings[url] || [];

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

              {/* Display average rating */}
              <p>
                ⭐ Avg Rating: {videoRatings.length > 0
                  ? (videoRatings.reduce((sum, r) => sum + r.rating, 0) / videoRatings.length).toFixed(1)
                  : 'No ratings yet'}
              </p>

              {/* Rating Section */}
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

              {/* Comment Input */}
              <div className="comment-section">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentInput[url] || ''}
                  onChange={(e) => handleCommentChange(url, e.target.value)}
                />
                <button onClick={() => handleCommentSubmit(url)}>Submit</button>
              </div>

              {/* Display Comments */}
              <div className="comments-display">
                <h4>Comments:</h4>
                {videoComments.length > 0 ? (
                  videoComments.map((c, i) => (
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
