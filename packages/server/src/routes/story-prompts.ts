// src/routes/story-prompt.ts
import express, { Request, Response } from "express";
import { Types } from "mongoose";
import { StoryPrompt } from "../models/story-prompt";
import StoryPromptService from "../services/story-prompt-svc";

const router = express.Router();

/** GET /api/story-prompts  -> list all prompts */
router.get("/", (_: Request, res: Response) => {
  StoryPromptService.index()
    .then((list: StoryPrompt[]) => res.json(list))
    .catch((err) => {
      console.error("Error listing prompts:", err);
      res.status(500).send("Error listing story prompts");
    });
});

/** GET /api/story-prompts/:id  -> get a single prompt */
router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  let objectId: Types.ObjectId;
  try {
    objectId = new Types.ObjectId(id);
  } catch {
    res.status(400).send("Invalid prompt id");
    return;
  }

  StoryPromptService.get(objectId)
    .then((prompt: StoryPrompt) => res.json(prompt))
    .catch((err) => {
      console.error("Error fetching prompt:", err);
      res.status(404).send(err);
    });
});

/** POST /api/story-prompts  -> create new prompt */
router.post("/", (req: Request, res: Response) => {
  const newPrompt = req.body; // should match StoryPrompt minus _id

  StoryPromptService.create(newPrompt)
    .then((prompt: StoryPrompt) => res.status(201).json(prompt))
    .catch((err) => {
      console.error("Error creating prompt:", err);
      res.status(500).send("Error creating story prompt");
    });
});

/** PUT /api/story-prompts/:id  -> update existing prompt */
router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const newPrompt = req.body;

  let objectId: Types.ObjectId;
  try {
    objectId = new Types.ObjectId(id);
  } catch {
    res.status(400).send("Invalid prompt id");
    return;
  }

  StoryPromptService.update(objectId, newPrompt)
    .then((prompt: StoryPrompt) => res.json(prompt))
    .catch((err) => {
      console.error("Error updating prompt:", err);
      res.status(404).send(err);
    });
});

/** DELETE /api/story-prompts/:id  -> delete prompt */
router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  StoryPromptService.remove(id)
    .then(() => res.status(204).end())
    .catch((err) => {
      console.error("Error deleting prompt:", err);
      res.status(404).send(err);
    });
});

export default router;
