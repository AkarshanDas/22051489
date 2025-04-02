import { useEffect, useState } from "react";
import { fetchFeed } from "../api/apiService";
import PostCard from "../components/PostCard";

const Feed = () => {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    fetchFeed().then(setFeed);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Feed</h1>
      <div className="grid grid-cols-3 gap-4">
        {feed.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
