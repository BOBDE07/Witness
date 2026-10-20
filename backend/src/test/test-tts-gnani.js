import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

console.log(
  "Gnani key loaded:",
  Boolean(process.env.GNANI_API_KEY)
);

async function testGnani() {
  const apiKey = process.env.GNANI_API_KEY;

  if (!apiKey) {
    console.error("GNANI_API_KEY is missing from .env");
    process.exitCode = 1;
    return;
  }

  try {
    const response = await fetch(
      "https://api.vachana.ai/api/v1/tts/sse",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key-ID": apiKey,
        },
        body: JSON.stringify({
          text: "Welcome to Witness. Let us begin the courtroom practice.",
          model: "timbre-v2.5",
          voice: "Deepak",
          language: "en-IN",
          speed: 1.0,
          audio_config: {
            sample_rate: 48000,
            num_channels: 1,
            sample_width: 2,
            encoding: "linear_pcm",
            container: "wav",
          },
        }),
      }
    );

    console.log("HTTP status:", response.status);

    if (!response.ok) {
      console.error("Gnani error:", await response.text());
      process.exitCode = 1;
      return;
    }

    const result = await response.text();

    console.log("Response received:", result.length > 0);
    console.log("Response preview:", result.slice(0, 300));
  } catch (error) {
    console.error("Request failed:", error.message);
    process.exitCode = 1;
  }
}

testGnani();
