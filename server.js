const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core'); // Used to fetch video info
const app = express();
const port = 3000; // Choose a port for your backend

// 1. Setup CORS
// This allows your frontend (e.g., on localhost:8000) to talk to this backend (on localhost:3000)
app.use(cors({
    origin: '*', // For development, allow all origins.
                 // In production, restrict this to your actual frontend URL.
    methods: ['GET']
}));

// Basic route to check if the server is running
app.get('/', (req, res) => {
  res.send('YouTube MP3 Converter Backend is running!');
});

// 2. The Conversion Endpoint
app.get('/convert', async (req, res) => {
    const youtubeUrl = req.query.url;

    if (!youtubeUrl || !ytdl.validateURL(youtubeUrl)) {
        return res.status(400).json({ 
            success: false, 
            error: 'Invalid or missing YouTube URL.' 
        });
    }

    console.log(`Received conversion request for: ${youtubeUrl}`);

    try {
        // --- STEP 1: Fetch Metadata ---
        const info = await ytdl.getInfo(youtubeUrl);
        const title = info.videoDetails.title.replace(/[^\w\s-]/g, ''); // Clean the title for a filename
        
        // --- STEP 2: Conversion (MOCK/Conceptual) ---
        // REAL CONVERSION: A production server would now pipe the audio stream 
        // through FFmpeg, save the MP3 file, and upload it to cloud storage.

        // MOCK RESPONSE: We will return a simulated download link.
        // In a real application, the download URL would be a temporary link
        // pointing to the newly generated MP3 file on your server or cloud storage.
        const mockDownloadUrl = `http://localhost:${port}/download/${info.videoDetails.videoId}.mp3`;

        // Wait a few seconds to simulate the conversion time
        await new Promise(resolve => setTimeout(resolve, 2000)); 

        // Send a success response back to the frontend
        res.json({
            success: true,
            title: title,
            mp3_url: mockDownloadUrl
        });

    } catch (error) {
        console.error('Error during conversion process:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to process video information.' 
        });
    }
});

// 3. Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    console.log(`Conversion API is at http://localhost:${port}/convert?url=YOUR_YOUTUBE_URL`);
});
  
