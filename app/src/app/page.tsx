"use client";

import { useState, useEffect } from "react";
import { storeData, removeData, getData } from "../../utils/localstorage";
import { useRouter } from "next/navigation";
import styleHomePage from "./css/homePage.module.css";
import { ref, set, push } from "firebase/database";
import { database } from "../../utils/firebase";

type Sentiment = {
  agree_count: number;
  disagree_count: number;
  neutral_count: number;
};

export default function YouTubeSentimentAnalyzer() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState(""); // To store the extracted video ID
  const [comments, setComments] = useState([]);
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    removeData("agree");
    removeData("disagree");
    removeData("netural");
    removeData("agree_percentages");
    removeData("disagree_percentages");
    removeData("netural_percentages");
    removeData("months");
  }, []);


  function calcPercentage(x, y, z) {
    let sum = x + y + z;
    let x_percentage = (x / sum) * 100 || 0;
    let y_percentage = (y / sum) * 100 || 0;
    let z_percentage = (z / sum) * 100 || 0;

    storeData("agree_percentages", x_percentage.toFixed(2));
    storeData("disagree_percentages", y_percentage.toFixed(2));
    storeData("netural_percentages", z_percentage.toFixed(2));

    return {
      x: x_percentage.toFixed(2),
      y: y_percentage.toFixed(2),
      z: z_percentage.toFixed(2),
    };
  }


  const extractVideoId = (url: string): string | null => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname === "www.youtube.com" || parsedUrl.hostname === "youtube.com") {
        return parsedUrl.searchParams.get("v");
      } else if (parsedUrl.hostname === "youtu.be") {
        return parsedUrl.pathname.slice(1);
      }
      return null;
    } catch (error) {
      console.error("Invalid URL:", error);
      return null;
    }
  };

  const handleScrapeComments = async () => {
    if (!videoUrl) {
      setError("Please enter a valid YouTube video URL.");
      return;
    }

    const id = extractVideoId(videoUrl);
    if (!id) {
      setError("Invalid YouTube video URL.");
      return;
    }

    setVideoId(id); // Store the extracted video ID
    storeData("url", videoUrl);

    setLoading(true);
    setError("");
    setComments([]);
    setSentiment(null);

    try {
      const response = await fetch(`./api/utapi?videoId=${id}`);
      const data = await response.json();

      if (response.ok) {
        setComments(data.comments || []);
        setSentiment(data.overall || null);
        console.log(data);

        storeData("agree", data.overall.agree_count);
        storeData("disagree", data.overall.disagree_count);
        storeData("netural", data.overall.neutral_count);
        storeData("months", data.total_comments_monthly);

        addData(id, videoUrl, data.comments, data.overall);
        router.push("/result");

        if (isClient && data.overall) {
        }
      } else {
        setError(data.error || "Failed to fetch comments.");
      }
    } catch (err) {
      setError("API limit Reached.Failed to Load some Componets ");
      setTimeout(() => {
        
        router.push("/result");
      }, 1000);
      
    } finally {
      setLoading(false);
    }
  };


  const percentages = sentiment
    ? calcPercentage(sentiment.agree_count, sentiment.disagree_count, sentiment.neutral_count)
    : null;

  const addData = (id: string, url: string, comments: any[], overall: Sentiment) => {
    const dataRef = ref(database, "Anchor");
    const newEntryRef = push(dataRef);

    set(newEntryRef, {
      VideoId: id,
      URL: url,
      Comments: comments,
      Sentiment: overall,
    })
      .then(() => console.log("Data added successfully!"))
      .catch((error) => console.error("Error adding data:", error));
  };

  return (
    <div className={`p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md ${styleHomePage.body}`}>
      <h1 className="text-2xl font-bold mb-4 text-center">YouTube Sentiment Analyzer</h1>

      <div className="mb-4">
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter YouTube video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
      </div>

      <button
        onClick={handleScrapeComments}
        className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md hover:bg-blue-600 transition"
        disabled={loading}
      >
        {loading ? "Scraping Comments..." : "Analyze Video"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {comments.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Scraped Comments ({comments.length}):</h2>
          <ul className="list-disc ml-6 max-h-40 overflow-y-auto">
            {comments.map((comment, index) => (
              <li key={index} className="mb-2">{comment}</li>
            ))}
          </ul>
        </div>
      )}

      {sentiment && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">Sentiment Analysis:</h2>
          <p><strong>Agree:</strong> {sentiment.agree_count}</p>
          <p><strong>Disagree:</strong> {sentiment.disagree_count}</p>
          <p><strong>Neutral:</strong> {sentiment.neutral_count}</p>
        </div>
      )}
    </div>
  );
}
