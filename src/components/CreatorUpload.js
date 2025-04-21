import React from "react";

export default function CreatorUpload() {
  return (
    <div>
      <h3>Upload Your Video</h3>
      <form>
        <input type="text" placeholder="Title" />
        <input type="text" placeholder="Caption" />
        <input type="text" placeholder="Location" />
        <input type="text" placeholder="People Present" />
        <input type="file" accept="video/*" />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
