import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../firebase";

const buildChatId = ({ productId, buyerId, sellerId }) => {
  return [productId, buyerId, sellerId].filter(Boolean).join("::");
};

export async function getOrCreateChat({ productId, buyerId, sellerId, productName, buyerName, sellerName }) {
  if (!productId || !buyerId || !sellerId) {
    throw new Error("Chat memerlukan productId, buyerId, dan sellerId.");
  }

  const chatId = buildChatId({ productId, buyerId, sellerId });
  const chatRef = doc(firestore, "chats", chatId);
  const snapshot = await getDoc(chatRef);

  if (!snapshot.exists()) {
    await setDoc(chatRef, {
      chatId,
      productId,
      buyerId,
      sellerId,
      productName: productName || "Produk",
      buyerName: buyerName || "Pembeli",
      sellerName: sellerName || "Seller",
      lastMessage: "Mulai percakapan",
      lastMessageAt: serverTimestamp(),
      lastMessageSender: buyerId,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
  }

  return { id: chatId, ref: chatRef };
}

export async function sendChatMessage({ chatId, senderId, senderRole, text }) {
  const normalizedText = (text || "").trim();
  if (!chatId || !senderId || !normalizedText) {
    return null;
  }

  const chatRef = doc(firestore, "chats", chatId);
  const messagesRef = collection(chatRef, "messages");

  try {
    const messageDoc = await addDoc(messagesRef, {
      senderId,
      senderRole,
      text: normalizedText,
      createdAt: serverTimestamp(),
    });

    await updateDoc(chatRef, {
      lastMessage: normalizedText,
      lastMessageAt: serverTimestamp(),
      lastMessageSender: senderId,
      updatedAt: serverTimestamp(),
      lastMessageId: messageDoc.id,
    });

    return true;
  } catch (error) {
    console.error("Firestore Write Error:", error);
    throw error;
  }
}

export function listenToChatMessages(chatId, callback) {
  if (!chatId) return () => {};

  const messagesRef = collection(firestore, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate?.() || null,
    }));
    callback(messages);
  }, (error) => {
    console.error("Chat listener failed for chatId:", chatId, error);
    callback([]);
  });
}

export async function listChatMessages(chatId) {
  if (!chatId) return [];

  const messagesRef = collection(firestore, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate?.() || null,
  }));
}

export function listenToSellerChats(sellerId, callback) {
  if (!sellerId) return () => {};

  const chatsRef = collection(firestore, "chats");
  const shouldShowAllChats = sellerId === "admin-seller" || sellerId === "admin" || sellerId === "all";
  const q = shouldShowAllChats ? query(chatsRef) : query(chatsRef, where("sellerId", "==", sellerId));

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs
      .map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
        lastMessageAt: docSnap.data().lastMessageAt?.toDate?.() || null,
      }))
      .sort((a, b) => {
        const aTime = a.lastMessageAt ? a.lastMessageAt.getTime() : 0;
        const bTime = b.lastMessageAt ? b.lastMessageAt.getTime() : 0;
        return bTime - aTime;
      });

    callback(chats);
  }, (error) => {
    console.error("Seller chat listener failed:", error);
    callback([]);
  });
}
