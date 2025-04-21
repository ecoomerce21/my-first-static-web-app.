import React, { useState } from "react";

export default function CommentSection() {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      setComments([...comments, input]);
      setInput("");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Add a comment" />
        <button type="submit">Post</button>
      </form>
      <ul>
        {comments.map((cmt, idx) => (
          <li key={idx}>{cmt}</li>
        ))}
      </ul>
    </div>
  );
}
