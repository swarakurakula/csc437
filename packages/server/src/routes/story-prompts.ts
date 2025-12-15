// src/routes/travelers.ts
import express, { Request, Response } from "express";
import { StoryPrompt } from "../models/story-prompt";
import mongoose from "mongoose"; // Import mongoose to use ObjectId

import StoryPromptService from "../services/story-prompt-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
    StoryPromptService.index()
      .then((list: StoryPrompt[]) => res.json(list))
      .catch((err) => res.status(500).send(err));
});
  
router.get("/:userid", (req: Request, res: Response) => {
    const { userid } = req.params;

    const objectId = new mongoose.Types.ObjectId(userid); // This converts the string to ObjectId

    StoryPromptService.get(objectId)
        .then((prompt: StoryPrompt) => res.json(prompt))
        .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
    const newPrompt = req.body;
  
    StoryPromptService.create(newPrompt)
      .then((prompt: StoryPrompt) =>
        res.status(201).json(prompt)
      )
      .catch((err) => res.status(500).send(err));
});

router.put("/:userid", (req: Request, res: Response) => {
    const { userid } = req.params;
    const newPrompt = req.body;

    const objectId = new mongoose.Types.ObjectId(userid); // This converts the string to ObjectId

    StoryPromptService
        .update(objectId, newPrompt)
        .then((prompt: StoryPrompt) => res.json(prompt))
        .catch((err) => res.status(404).end());
});

router.delete("/:userid", (req: Request, res: Response) => {
    const { userid } = req.params;
  
    StoryPromptService.remove(userid)
      .then(() => res.status(204).end())
      .catch((err) => res.status(404).send(err));
  });

export default router;