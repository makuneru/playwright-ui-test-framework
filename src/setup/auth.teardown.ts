import { test as teardown } from "@playwright/test";
import path from "path";
import fs from "fs";

const authFile = path.join(__dirname, "../../.auth/user.json");

teardown("cleanup authentication", async ({}) => {
  // Remove authentication state file
  if (fs.existsSync(authFile)) {
    fs.unlinkSync(authFile);
    console.log("✓ Authentication state cleaned up");
  }
});
