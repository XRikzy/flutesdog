import { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, runTransaction } from "firebase/firestore";
import { auth, db } from "../webservice/firebase";

type AuthRole = "admin" | "user" | null;

interface AuthContextProps {
  user: FirebaseUser | null;
  role: AuthRole;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<AuthRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let authChange = 0;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const change = ++authChange;
      setUser(currentUser);
      setRole(null);
      setLoading(Boolean(currentUser));
      if (currentUser) {
        try {
          const userRef = doc(db, "Users", currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (change !== authChange) return;
          const role = userDoc.exists() ? userDoc.data().role : await runTransaction(db, async (transaction) => {
            const current = await transaction.get(userRef);
            if (current.exists()) return current.data().role;
            transaction.set(userRef, {
              uid: currentUser.uid,
              email: currentUser.email || "",
              displayName: currentUser.displayName || "",
              photoURL: currentUser.photoURL || "",
              role: "user",
              createdAt: new Date().toISOString(),
            });
            return "user";
          });
          if (change === authChange) setRole(role === "admin" ? "admin" : "user");
        } catch (error) {
          console.error("Error al obtener o guardar el rol del usuario:", error);
          if (change === authChange) setRole("user");
        } finally {
          if (change === authChange) setLoading(false);
        }
      }
    });

    return () => {
      authChange++;
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
