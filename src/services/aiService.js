import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "../data/mangroveKnowledge";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("API Key Gemini tidak ditemukan pada VITE_GEMINI_API_KEY!");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// Pastikan fungsi ini di-export secara bernama (named export)
export const askMangroBot = async (userMessage, history = []) => {
  if (!apiKey || apiKey.trim() === "") {
    console.warn("API Key kosong. Menggunakan fallback lokal.");
    return getLocalFallbackResponse(userMessage);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Gemini Error Detail (Primary Model):", error);

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

function normalizeText(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshteinDistance(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, () => Array(a.length + 1).fill(0));

  for (let i = 0; i <= a.length; i += 1) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j - 1][i] + 1,
        matrix[j][i - 1] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }

  return matrix[b.length][a.length];
}

function fuzzyContains(text, term, maxDistance = 1) {
  const normalizedText = normalizeText(text);
  const normalizedTerm = normalizeText(term);

  if (!normalizedTerm) return false;
  if (normalizedText.includes(normalizedTerm)) return true;

  const textTokens = normalizedText.split(" ").filter(Boolean);
  const termTokens = normalizedTerm.split(" ").filter(Boolean);

  for (const textToken of textTokens) {
    if (textToken === normalizedTerm) return true;
    if (levenshteinDistance(textToken, normalizedTerm) <= maxDistance) return true;
  }

  for (const termToken of termTokens) {
    for (const textToken of textTokens) {
      if (levenshteinDistance(textToken, termToken) <= Math.max(1, Math.floor(termToken.length / 3))) {
        return true;
      }
    }
  }

  return false;
}

function hasAnyKeyword(text, keywords, maxDistance = 1) {
  return keywords.some((keyword) => fuzzyContains(text, keyword, maxDistance));
}

// Respon Lokal Pintar dan Lengkap jika API Offline / Error
function getLocalFallbackResponse(userMessage) {
  const query = normalizeText(userMessage);

  if (hasAnyKeyword(query, ["jeruju", "kerupuk jeruju", "kerupuk", "krupuk", "krupuk jeruju"])) {
    return "🍘 **Kerupuk Jeruju** adalah produk UMKM khas Kuala Langsa yang terbuat dari olahan daun mangrove Jeruju (*Acanthus ilicifolius*). Memiliki cita rasa renyah, gurih, dan kaya akan antioksidan alami! 🌿";
  }

  if (hasAnyKeyword(query, ["produk", "jual", "beli", "belanja", "pesan", "order", "umkm", "olahan", "lokal", "produk lokal", "makanan khas"], 2)) {
    return "Di Mangrovise, kami mempromosikan produk UMKM unggulan Kuala Langsa:\n1. 🍘 **Kerupuk Jeruju** (renyah & kaya antioksidan)\n2. 🍮 **Dodol & Sirup Lindur** (dari buah Bruguiera gymnorhiza)\n3. 🎨 **Batik Solok Mangrove** (pewarna alami ekstrak mangrove) 🌿";
  }

  if (hasAnyKeyword(query, ["lindur", "buah lindur", "dodol", "sirup", "dodol lindur", "sirup lindur", "buah"], 2)) {
    return "Buah Lindur (*Bruguiera gymnorhiza*) kaya akan serat dan karbohidrat. Di Kuala Langsa, buah ini diolah warga menjadi tepung untuk bahan baku **Dodol Mangrove** dan **Sirup Lindur**! 🌿";
  }

  if (hasAnyKeyword(query, ["batik", "batik solok", "solok", "kain batik"], 2)) {
    return "🎨 **Batik Solok Mangrove** menggunakan pewarna alami yang diekstrak secara ramah lingkungan dari bagian tanaman mangrove pesisir Kuala Langsa.";
  }

  if (hasAnyKeyword(query, ["karbon", "co2", "carbon", "dampak", "emisi", "hitung", "hitung dampak", "impact", "kalkulator"], 2)) {
    return "Setiap pohon mangrove menyerap rata-rata **12.3 kg CO2/tahun** (Alongi, 2012), 3-5x lebih tinggi dari hutan darat! Kamu bisa mengukur kontribusimu di fitur **Kalkulator Dampak**. 🌊";
  }

  if (hasAnyKeyword(query, ["pohon", "virtual", "virtual tree", "pohon virtual", "tree", "growing tree", "game", "gaming", "adopsi pohon", "simulasi", "tumbuhan"], 2)) {
    return "Fitur **Virtual Growing Tree** memungkinkan kamu mengadopsi pohon digital yang tumbuh seiring aktivitas edukasimu di platform ini! 🌳";
  }

  if (hasAnyKeyword(query, ["lokasi", "tempat", "alamat", "langsa", "kuala langsa", "kota langsa", "dimana"], 2)) {
    return "Lokasi konservasi mangrove utama di Mangrovise adalah **Kuala Langsa, Aceh**. Hutan mangrove Kota Langsa merupakan salah satu ekosistem mangrove terlengkap dan terbesar di Sumatra. 🌊";
  }

  if (hasAnyKeyword(query, ["halo", "hai", "hello", "hi", "pagi", "siang", "sore", "bantu", "help", "tolong", "assalamualaikum"], 1)) {
    return "Halo! Saya MangroBot 🌿. Ada yang bisa saya bantu tentang produk UMKM (Kerupuk Jeruju, Dodol Lindur), fitur Pohon Virtual, atau Kalkulator Dampak?";
  }

  return "MangroBot siap membantu edukasi mangrove Kuala Langsa! Kamu bisa bertanya tentang Kerupuk Jeruju, Buah Lindur, Pohon Virtual, Lokasi Kuala Langsa, atau Kalkulator Dampak CO2. 🌿";
}