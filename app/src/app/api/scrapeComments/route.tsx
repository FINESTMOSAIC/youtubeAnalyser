import puppeteer from "puppeteer";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const videoUrl = searchParams.get("videoUrl");

  if (!videoUrl) {
    return new Response(
      JSON.stringify({ error: "Video URL is required" }),
      { status: 400 }
    );
  }

  try {
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true, // Set to true for headless mode
    });
    const page = await browser.newPage();

    // Navigate to the YouTube video URL
    await page.goto(videoUrl, { waitUntil: "networkidle2" });

    // Wait for the comments section to load
    await page.waitForSelector("ytd-comments");

    // Scroll to load comments
    await autoScroll(page);

    // Extract comments
    const comments = await page.evaluate(() => {
      const commentNodes = document.querySelectorAll("#content-text");
      return Array.from(commentNodes).map((node) => node.innerText.trim());
    });

    // Close the browser
    await browser.close();

    // Send the comments to the Flask API for sentiment analysis
    const flaskApiUrl = "https://agrim25.pythonanywhere.com/analyze"; // Flask API endpoint
    const response = await fetch(flaskApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comments), // Send comments as JSON
    });

    if (!response.ok) {
      throw new Error(`Flask API returned error: ${response.statusText}`);
    }

    const sentimentData = await response.json();

    return new Response(
      JSON.stringify(sentimentData),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error scraping YouTube or calling Flask API:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to process comments or fetch sentiment analysis." }),
      { status: 500 }
    );
  }
}

// Helper function to scroll the page
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
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
