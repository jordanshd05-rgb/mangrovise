import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, firestore } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile = null;
    let isActive = true;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!isActive) return;

      setFirebaseUser(currentUser);

      unsubscribeProfile?.();
      unsubscribeProfile = null;

      if (!currentUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const userRef = doc(firestore, "users", currentUser.uid);

      unsubscribeProfile = onSnapshot(userRef, (snapshot) => {
        if (!isActive) return;

        setProfile(
          snapshot.exists()
            ? { id: snapshot.id, ...snapshot.data() }
            : {
                id: currentUser.uid,
                email: currentUser.email,
                role: "buyer",
              }
        );
        setLoading(false);
      });
    });

    return () => {
      isActive = false;
      unsubscribeAuth();
      unsubscribeProfile?.();
    };
  }, []);

  const role = profile?.role || "buyer";

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        profile,
        role,
        loading,
        isAuthenticated: Boolean(firebaseUser),
        isSeller: role === "seller",
        isBuyer: role === "buyer",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }

  return context;
}