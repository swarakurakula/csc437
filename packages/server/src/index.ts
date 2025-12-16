// src/index.ts
import { connect } from "./services/mongo";
import mongoose from "mongoose"; // Import mongoose to use ObjectId
import express, { Request, Response } from "express";
import StoryPromptService from "./services/story-prompt-svc";
import { StoryPromptPage } from "./pages/story-prompt";
import prompts from "./routes/story-prompts";
import auth, { authenticateUser } from "./routes/auth";
import { LoginPage } from "./pages/auth";

import fs from "node:fs/promises";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

connect("spp");

app.use(express.static(staticDir));

// Middleware:
app.use(express.json());

app.use("/auth", auth);
app.use("/api/story-prompts", prompts); //authenticateUser, 

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.get("/login", (req: Request, res: Response) => {
  const page = new LoginPage();
  res.set("Content-Type", "text/html").send(page.render());
});

// app.get("/story-prompts/:promptId", (req: Request, res: Response) => {
//     const { promptId } = req.params;  // Get the prompt ID from the URL
//     const data = getStoryPrompt(promptId);  // Retrieve the corresponding data
//     const page = new StoryPromptPage(data);  // Instantiate the page with the data

//     res.set("Content-Type", "text/html").send(page.render());  // Render and send the HTML page
//   });

app.get("/story-prompts/:promptId", (req: Request, res: Response) => {
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

app.use("/app", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
    res.send(html)
  );
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// app.listen(port, '0.0.0.0', () => {
//   console.log(`Server running on port ${port}`);
// });
