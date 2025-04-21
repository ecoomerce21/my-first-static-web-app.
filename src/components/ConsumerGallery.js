import React from "react";
import CommentSection from "./CommentSection";

export default function ConsumerGallery() {
  return (
    <div>
      <h3>Gallery</h3>
      <div>
        <video controls width="320">
          <source src="/sample-video.mp4" type="video/mp4" />
        </video>
        <CommentSection />
      </div>
    </div>
  );
}
