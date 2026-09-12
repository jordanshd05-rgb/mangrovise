import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../firebase";

const ARTICLES_COLLECTION = "articles";

function normalizeStatus(value) {
  return String(value || "draft").trim().toLowerCase();
}

function normalizeDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") return new Date(value);
  return null;
}

export function createSlug(title = "") {
  return String(title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || `artikel-${Date.now()}`;
}

export function calculateReadTime(content = "", wordsPerMinute = 200) {
  const wordCount = String(content)
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  if (!wordCount) return 1;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

function normalizeArticle(rawDoc) {
  const raw = rawDoc.data();
  const createdAt = normalizeDate(raw.createdAt) || new Date();
  const publishedAt = normalizeDate(raw.publishedAt);

  return {
    id: rawDoc.id,
    ...raw,
    title: raw.title || "Judul artikel",
    slug: raw.slug || createSlug(raw.title || "artikel"),
    category: raw.category || "Umum",
    status: normalizeStatus(raw.status),
    content: raw.content || "",
    coverImage: raw.coverImage || raw.coverBase64 || "",
    excerpt: raw.excerpt || "",
    author: raw.author || "Mangrovise Team",
    readTime: Number(raw.readTime) || calculateReadTime(raw.content || ""),
    createdAt,
    publishedAt,
  };
}

export function listenToPublishedArticles(callback) {
  const articlesRef = collection(firestore, ARTICLES_COLLECTION);

  return onSnapshot(
    articlesRef,
    (snapshot) => {
      const articles = snapshot.docs
        .map(normalizeArticle)
        .filter((article) => article.status === "published")
        .sort((a, b) => {
          const left = normalizeDate(a.publishedAt) || normalizeDate(a.createdAt) || new Date(0);
          const right = normalizeDate(b.publishedAt) || normalizeDate(b.createdAt) || new Date(0);
          return right.getTime() - left.getTime();
        });

      callback(articles);
    },
    (error) => {
      console.error("Loading published articles failed:", error);
      callback([]);
    }
  );
}

export async function getPublishedArticles() {
  const snapshot = await getDocs(collection(firestore, ARTICLES_COLLECTION));

  return snapshot.docs
    .map(normalizeArticle)
    .filter((article) => article.status === "published")
    .sort((a, b) => {
      const left = normalizeDate(a.publishedAt) || normalizeDate(a.createdAt) || new Date(0);
      const right = normalizeDate(b.publishedAt) || normalizeDate(b.createdAt) || new Date(0);
      return right.getTime() - left.getTime();
    });
}

export async function getAllArticles() {
  const articlesQuery = query(
    collection(firestore, ARTICLES_COLLECTION),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(articlesQuery);
  return snapshot.docs.map(normalizeArticle);
}

export async function getArticleBySlug(slug) {
  if (!slug) return null;

  const slugQuery = query(
    collection(firestore, ARTICLES_COLLECTION),
    where("slug", "==", slug),
    limit(1)
  );

  const snapshot = await getDocs(slugQuery);
  if (snapshot.empty) return null;
  return normalizeArticle(snapshot.docs[0]);
}

export async function saveArticle(articleData = {}) {
  const title = String(articleData.title || "").trim();
  const content = String(articleData.content || "").trim();
  const slug = articleData.slug || createSlug(title || articleData.title || "artikel");
  const excerpt = String(articleData.excerpt || "").trim() ||
    content.replace(/\s+/g, " ").slice(0, 180);

  const normalizedStatus = normalizeStatus(articleData.status || "draft");

  const payload = {
    title: title || "Judul artikel",
    slug,
    category: articleData.category || "Umum",
    coverImage: articleData.coverImage || "",
    coverBase64: articleData.coverImage || "",
    content,
    excerpt,
    status: normalizedStatus,
    author: articleData.author || "Mangrovise Team",
    readTime: Number(articleData.readTime) || calculateReadTime(content),
    createdAt: articleData.createdAt || serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt:
      normalizedStatus === "published"
        ? articleData.publishedAt || serverTimestamp()
        : articleData.publishedAt || null,
  };

  if (articleData.id) {
    const articleRef = doc(firestore, ARTICLES_COLLECTION, articleData.id);
    await updateDoc(articleRef, payload);
    return { id: articleData.id, ...payload };
  }

  const docRef = await addDoc(collection(firestore, ARTICLES_COLLECTION), payload);
  return { id: docRef.id, ...payload };
}

export async function deleteArticle(articleId) {
  if (!articleId) return;
  await deleteDoc(doc(firestore, ARTICLES_COLLECTION, articleId));
}
