"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_mongo = require("./services/mongo");
var import_mongoose = __toESM(require("mongoose"));
var import_express = __toESM(require("express"));
var import_story_prompt_svc = __toESM(require("./services/story-prompt-svc"));
var import_story_prompt = require("./pages/story-prompt");
var import_story_prompts = __toESM(require("./routes/story-prompts"));
var import_auth = __toESM(require("./routes/auth"));
var import_auth2 = require("./pages/auth");
var import_promises = __toESM(require("node:fs/promises"));
var import_path = __toESM(require("path"));
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
const staticDir = process.env.STATIC || "public";
(0, import_mongo.connect)("spp");
app.use(import_express.default.static(staticDir));
app.use(import_express.default.json());
app.use("/auth", import_auth.default);
app.use("/api/story-prompts", import_story_prompts.default);
app.get("/hello", (req, res) => {
  res.send("Hello, World");
});
app.get("/login", (req, res) => {
  const page = new import_auth2.LoginPage();
  res.set("Content-Type", "text/html").send(page.render());
});
app.get("/story-prompts/:promptId", (req, res) => {
  const { promptId } = req.params;
  const objectId = new import_mongoose.default.Types.ObjectId(promptId);
  import_story_prompt_svc.default.get(objectId).then((data) => {
    const page = new import_story_prompt.StoryPromptPage(data);
    res.set("Content-Type", "text/html").send(page.render());
  }).catch((err) => {
    console.error("Error fetching story prompt:", err);
    res.status(500).send("Internal Server Error");
  });
});
app.use("/app", (req, res) => {
  const indexHtml = import_path.default.resolve(staticDir, "index.html");
  import_promises.default.readFile(indexHtml, { encoding: "utf8" }).then(
    (html) => res.send(html)
  );
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
