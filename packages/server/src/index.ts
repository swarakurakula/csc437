// src/index.ts
import { connect } from "./services/mongo";
import mongoose from "mongoose"; // Import mongoose to use ObjectId
import express, { Request, Response } from "express";
import StoryPromptService from './services/story-prompt-svc';
import { StoryPromptPage } from './pages/story-prompt'; 

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

connect("spp");

app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

// app.get("/story-prompt/:promptId", (req: Request, res: Response) => {
//     const { promptId } = req.params;  // Get the prompt ID from the URL
//     const data = getStoryPrompt(promptId);  // Retrieve the corresponding data
//     const page = new StoryPromptPage(data);  // Instantiate the page with the data
  
//     res.set("Content-Type", "text/html").send(page.render());  // Render and send the HTML page
//   });

  app.get("/story-prompt/:promptId", (req: Request, res: Response) => {
    const { promptId } = req.params; // Extract the prompt ID from the URL

    const objectId = new mongoose.Types.ObjectId(promptId); // This converts the string to ObjectId
  
    // Fetch the story prompt asynchronously
    StoryPromptService.get(objectId)
      .then((data) => {
        
        // Render the page with the fetched data
        const page = new StoryPromptPage(data);
        res.set("Content-Type", "text/html").send(page.render());
      })
      .catch((err) => {
        console.error("Error fetching story prompt:", err);
        res.status(500).send("Internal Server Error");
      });
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
