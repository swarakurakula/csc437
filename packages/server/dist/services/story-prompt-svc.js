"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var story_prompt_svc_exports = {};
__export(story_prompt_svc_exports, {
  default: () => story_prompt_svc_default
});
module.exports = __toCommonJS(story_prompt_svc_exports);
var import_mongoose = require("mongoose");
const StoryPromptSchema = new import_mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    categories: { type: String, required: true, trim: true },
    prompt: { type: String, required: true, trim: true },
    actions: [
      {
        label: { type: String, required: true, trim: true },
        emoji: { type: String, required: true, trim: true }
      }
    ],
    comments: {
      icon: { type: String, required: true, trim: true },
      linkText: { type: String, required: true, trim: true },
      linkHref: { type: String, trim: true }
      // Optional
    }
  },
  { collection: "prompts" }
  // Specify the MongoDB collection name
);
const StoryPromptModel = (0, import_mongoose.model)("StoryPrompt", StoryPromptSchema);
function index() {
  return StoryPromptModel.find();
}
function get(id) {
  console.log("Fetching story prompt with ID:", id);
  return StoryPromptModel.findById(id).then((prompt) => {
    if (prompt) {
      console.log("Fetched story prompt:", prompt);
      return prompt;
    }
    throw new Error(`Prompt with ID ${id} not found`);
  }).catch((err) => {
    console.error("Error fetching story prompt:", err);
    throw err.message || "Error fetching story prompt";
  });
}
var story_prompt_svc_default = { index, get };
