"use client"

import ChartComponent from "../chart/barchart";
import styleResult from "../css/result.module.css";
import CommentsOverview from "../chart/coments";
import Link from 'next/link';
import { useState, useEffect } from "react";
import styles from './styles.module.css'
import CommentDistribution from "../chart/page"



export default function Result() {
    const [isChartLoaded, setIsChartLoaded] = useState(false);


useEffect(() => {
    // Simulate a delay or waiting for the component to load
    const timer = setTimeout(() => {
      setIsChartLoaded(true);
    }, 1000); // 1-second delay for demonstration

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

// export default function Result() {
  return (
    <div className={styleResult.body}>
    <div className={styleResult.nav}>
        <p><Link className={styleResult.Link} href="/">Home</Link> &gt; Result </p>
    </div>


    <div className={styleResult.grid}>
      <ChartComponent />
      <CommentsOverview />
    </div>

    <div className={styleResult.barchart}>
      {isChartLoaded ? (
        <CommentDistribution />
      ) : (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-spin"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v4M12 22v-4M20.8 7.2l-3 3M3.2 7.2l3 3M20.8 16.8l-3-3M3.2 16.8l3-3" />
          </svg>
          <p>Loading Chart...</p>
        </div>
      )}
    </div>



    <div className={styleResult.footer}>
    
      <button className={styleResult.backbutton}>
      <Link  href="/">Back to Input</Link>
      </button>
      </div>

    </div>
  );
}
