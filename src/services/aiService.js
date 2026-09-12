import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "../data/mangroveKnowledge";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("API Key Gemini tidak ditemukan pada VITE_GEMINI_API_KEY!");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// Memperbaiki Poin 2: Terima parameter history agar signature sinkron dengan ChatWidget.jsx
export const askMangroBot = async (userMessage, history = []) => {
  if (!apiKey || apiKey.trim() === "") {
    console.warn("API Key kosong. Menggunakan fallback lokal.");
    return getLocalFallbackResponse(userMessage);
  }

  try {
    // Model Utama (gemini-2.0-flash)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT, // System prompt dipasang di sini
    });

    // Memperbaiki Poin 3: Hanya kirim userMessage (tidak menduplikasi SYSTEM_PROMPT)
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    return response.text();

  } catch (error) {
    // Memperbaiki Poin 4: Log error asli dari try pertama secara detail
    console.error("Gemini Error Detail (Primary Model gemini-2.0-flash):", error);

    try {
      console.warn("Mencoba fallback ke model gemini-1.5-flash-latest...");
      const fallbackModel = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
        systemInstruction: SYSTEM_PROMPT,
      });

      const result = await fallbackModel.generateContent(userMessage);
      const response = await result.response;
      return response.text();

    } catch (fallbackError) {
      console.error("Gemini Error Detail (Fallback Model):", fallbackError);
      return getLocalFallbackResponse(userMessage);
    }
  }
};

// Respon Lokal Aman jika API Bermasalah
function getLocalFallbackResponse(userMessage) {
  const query = userMessage.toLowerCase();
  
  if (query.includes("lindur") || query.includes("buah")) {
    return "Buah Lindur (Bruguiera gymnorhiza) dapat diolah menjadi tepung kaya nutrisi untuk pembuatan olahan pangan lokal seperti dodol dan kue tradisional di Kuala Langsa. 🌿";
  } else if (query.includes("karbon") || query.includes("dampak")) {
    return "Satu pohon mangrove mampu menyerap rata-rata 12.3 kg CO2 per tahun (Alongi, 2012), 3-5x lebih tinggi dari hutan daratan! 🌊";
  } else if (query.includes("halo") || query.includes("hai")) {
    return "Halo! Saya MangroBot 🌿. Ada yang bisa saya bantu tentang edukasi mangrove, produk lokal, atau kalkulator dampak?";
  }
  
  return `Terima kasih pertanyaannya tentang "${userMessage}". MangroBot siap membantu edukasi mangrove Kuala Langsa! 🌿`;
}