import puppeteer from "puppeteer-core";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const videoUrl = searchParams.get("videoUrl");

  if (!videoUrl) {
    return NextResponse.json(
      { error: "Video URL is required" },
      { status: 400 }
    );
  }


  try {
    // Launch Puppeteer with puppeteer-core
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: 'C:\\Users\\kulsh\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe', // Update this path based on your system
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--no-zygote",
        "--single-process",
      ],
    });

    const page = await browser.newPage();

    // Set a timeout for the page
    page.setDefaultNavigationTimeout(60000); // 60 seconds

    // Optimize resource usage by blocking unnecessary requests
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (["image", "stylesheet", "font", "media"].includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });

    // Navigate to the YouTube video URL
    await page.goto(videoUrl, { waitUntil: "networkidle2", timeout: 60000 });

    // Wait for the comments section to load
    await page.waitForSelector("ytd-comments", { timeout: 30000 });

    // Scroll to load all comments
    await autoScroll(page);

    // Extract comments
    const comments = await page.evaluate(() => {
      const commentNodes = document.querySelectorAll("#content-text");
      return Array.from(commentNodes).map((node) =>
        (node as HTMLElement).innerText.trim()
      );
    });

    if (!comments.length) {
      throw new Error("No comments found on the page.");
    }

    // Send comments to Flask API for sentiment analysis
    const flaskApiUrl = "https://agrim25.pythonanywhere.com/analyze"; // Flask API endpoint
    const response = await fetch(flaskApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comments }),
    });

    if (!response.ok) {
      throw new Error(`Flask API returned error: ${response.statusText}`);
    }

    const sentimentData = await response.json();

    return NextResponse.json(sentimentData, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error scraping YouTube or calling Flask API:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }

    return NextResponse.json(
      { error: "Failed to process comments or fetch sentiment analysis." },
      { status: 500 }
    );
  }
}

// Helper function to scroll the page
async function autoScroll(page: any) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}
