import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"

import { schemaTypes } from "./schemas"

export default defineConfig({
  name: "default",
  title: "BRICS News",

  projectId: "e1afdefg", // Seu project ID
  dataset: "production",

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
