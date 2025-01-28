
// Import necessary packages
const API_KEY = "AIzaSyByyt6WtWAse7pZtMewmbqBsEhFDanPbVk"; // Replace with your YouTube API key
const API_URL = "https://www.googleapis.com/youtube/v3/commentThreads"; // YouTube Comments API

// Function to fetch comments

type Comment = {
    text: string;
    timestamp: string;
};

// const [comments, setComments] = useState<Comment[]>([]);

async function fetchComments(videoId: string): Promise<Comment[]> {
    const params = new URLSearchParams({
        part: "snippet",
        videoId: videoId,
        key: API_KEY,
        maxResults: "100"
    });

    let comments: Comment[] = [];  // Explicitly declare type
    let nextPageToken: string | null = null;

    try {
        do {
            // Declare response type here
            const response: Response = await fetch(`${API_URL}?${params}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`);
            const data = await response.json();

            if (data.items) {
                data.items.forEach((item: any) => {
                    const snippet = item.snippet.topLevelComment.snippet;
                    comments.push({
                        text: snippet.textDisplay,
                        timestamp: snippet.publishedAt
                    });
                });
            }

            nextPageToken = data.nextPageToken || null;
        } while (nextPageToken);

        return comments;
    } catch (error) {
        console.error("Error fetching comments:", error);
        return [];  // Return empty array in case of error
    }
}
// Named export for GET request
export async function GET(req: Request) {
    const url = new URL(req.url);
    const videoId = url.searchParams.get("videoId");

    if (!videoId) {
        return new Response(JSON.stringify({ error: "Video ID is required." }), {
            status: 400,
        });
    }

    try {
        const comments = await fetchComments(videoId);

        // Assuming you are sending the comments to your Python API
        const pythonApiUrl = "https://agrim25.pythonanywhere.com/analyze"; // Replace with your Python API URL
        const response = await fetch(pythonApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(comments)
        });

        if (!response.ok) {
            throw new Error(`Python API Error: ${response.statusText}`);
        }

        const analysisResult = await response.json();

        return new Response(JSON.stringify(analysisResult), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error("Error in GET handler:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch and analyze comments." }), {
            status: 500,
        });
    }
}

