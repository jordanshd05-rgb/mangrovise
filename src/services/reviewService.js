import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { firestore } from "../firebase";

export async function addReview(productId, { userId, userName, rating, comment, photoBase64 }) {
  const reviewData = {
    userId: userId || "anonymous-user",
    userName: userName || "Pengguna Mangrovise",
    rating: Number(rating) || 5,
    comment: comment || "",
    photoBase64: photoBase64 || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(
    collection(firestore, "products", productId, "reviews"),
    reviewData
  );

  return {
    id: docRef.id,
    ...reviewData,
  };
}

export async function deleteReview(productId, reviewId) {
  if (!productId || !reviewId) return;

  await deleteDoc(doc(firestore, "products", productId, "reviews", reviewId));
}

export function listenToReviews(productId, callback) {
  if (!productId) {
    callback([]);
    return () => {};
  }

  const reviewsQuery = query(
    collection(firestore, "products", productId, "reviews"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    reviewsQuery,
    (snapshot) => {
      const reviews = snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      }));
      callback(reviews);
    },
    () => {
      callback([]);
    }
  );
}
