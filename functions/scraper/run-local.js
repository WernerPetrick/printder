/**
 * Local runner for testing the scraper outside of Appwrite Functions.
 * Usage: node run-local.js
 *
 * Set your API key in functions/scraper/.env before running.
 */

import "dotenv/config";
import main from "./src/main.js";

// Simulate the Appwrite Function context
const context = {
  req: {},
  res: {
    json: (data) => {
      console.log("\n=== Scraper Result ===");
      console.log(JSON.stringify(data, null, 2));
      return data;
    },
  },
  log: (msg) => console.log(`[LOG] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`),
};

main(context).catch((err) => {
  console.error("Scraper failed:", err);
  process.exit(1);
});
