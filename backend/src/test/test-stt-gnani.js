
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, "../../.env"),
});

async function testGnaniSTT() {
    const apiKey = process.env.GNANI_API_KEY;

    if (!apiKey) {
        console.error("GNANI_API_KEY is missing from .env");
        process.exitCode = 1;
        return;
    }

    try {
        const audioPath = path.join(__dirname, "test-audio.m4a");
        const audioBuffer = await readFile(audioPath);

        const formData = new FormData();

        formData.append(
            "audio_file",
            new Blob([audioBuffer], { type: "audio/wav" }),
            "test-audio.wav"
        );

        formData.append("language_code", "en-IN");
        formData.append("preferred_language", "en-IN");
        formData.append("format", "transcribe");
        formData.append("itn_native_numerals", "true");

        const response = await fetch(
            "https://api.vachana.ai/stt/v3",
            {
                method: "POST",
                headers: {
                    "X-API-Key-ID": apiKey,
                },
                body: formData,
            }
        );

        console.log("HTTP status:", response.status);

        const result = await response.text();

        if (!response.ok) {
            console.error("Gnani STT error:", result);
            process.exitCode = 1;
            return;
        }

        let data;

        try {
            data = JSON.parse(result);
        } catch {
            console.error("Unexpected response format:", result);
            process.exitCode = 1;
            return;
        }

        console.log("Success:", data.success);
        console.log("Transcript:", data.transcript ?? "No transcript returned");
    } catch (error) {
        console.error("STT test failed:", error.message);
        process.exitCode = 1;
    }
}

testGnaniSTT();
