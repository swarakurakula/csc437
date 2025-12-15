"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var story_prompts_exports = {};
__export(story_prompts_exports, {
  default: () => story_prompts_default
});
module.exports = __toCommonJS(story_prompts_exports);
var import_express = __toESM(require("express"));
var import_mongoose = __toESM(require("mongoose"));
var import_story_prompt_svc = __toESM(require("../services/story-prompt-svc"));
const router = import_express.default.Router();
router.get("/", (_, res) => {
  import_story_prompt_svc.default.index().then((list) => res.json(list)).catch((err) => res.status(500).send(err));
});
router.get("/:userid", (req, res) => {
  const { userid } = req.params;
  const objectId = new import_mongoose.default.Types.ObjectId(userid);
  import_story_prompt_svc.default.get(objectId).then((prompt) => res.json(prompt)).catch((err) => res.status(404).send(err));
});
router.post("/", (req, res) => {
  const newPrompt = req.body;
  import_story_prompt_svc.default.create(newPrompt).then(
    (prompt) => res.status(201).json(prompt)
  ).catch((err) => res.status(500).send(err));
});
router.put("/:userid", (req, res) => {
  const { userid } = req.params;
  const newPrompt = req.body;
  const objectId = new import_mongoose.default.Types.ObjectId(userid);
  import_story_prompt_svc.default.update(objectId, newPrompt).then((prompt) => res.json(prompt)).catch((err) => res.status(404).end());
});
router.delete("/:userid", (req, res) => {
  const { userid } = req.params;
  import_story_prompt_svc.default.remove(userid).then(() => res.status(204).end()).catch((err) => res.status(404).send(err));
});
var story_prompts_default = router;
