/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Layanan AI Menggunakan Google Gemini untuk MangroBot
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "../data/mangroveKnowledge.js";

// Konfigurasi API Key dari environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    "VITE_GEMINI_API_KEY tidak diset. Fungsi MangroBot akan gagal. " +
    "Tambahkan VITE_GEMINI_API_KEY ke file .env Anda."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Fungsi utama: Bertanya ke MangroBot (Gemini Flash 1.5)
 * @param {string} userMessage - Pesan dari pengguna
 * @param {Array} chatHistory - Riwayat percakapan [{role: 'user'|'model', content: 'teks'}]
 * @returns {Promise<string>} - Respons teks dari AI
 */
export async function askMangroBot(userMessage, chatHistory = []) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT
    });

    // Format chat history untuk Gemini
    const history = chatHistory.map((msg) => ({
      role: msg.role === "assistant" ? "model" : msg.role,
      parts: [{ text: msg.content || msg.text || "" }],
    }));

    // Tambahkan system prompt sebagai message pertama, lalu history, lalu pesan user
    const allMessages = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      ...history,
      { role: "user", parts: [{ text: userMessage }] },
    ];

    const response = await model.generateContent(allMessages);
    const result = await response.response;
    return result.text();
  } catch (error) {
    console.error("MangroBot AI error:", error);
    throw new Error(
      "Maaf, MangroBot sedang mengalami kendala teknis. " +
      "Silakan coba lagi dalam beberapa menit."
    );
  }
}

/**
 * Fungsi bantuan: Cek ketersediaan layanan AI
 * @returns {Promise<boolean>} - Benar jika AI siap digunakan
 */
export async function isMangroBotAvailable() {
  try {
    if (!apiKey) return false;
    genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    return true;
  } catch {
    return false;
  }
}