import { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, getDocs, collection, limit, query } from "firebase/firestore";
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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        try {
          // Obtener rol del usuario de Firestore
          const userRef = doc(db, "Users", currentUser.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            setRole(userDoc.data().role || "user");
          } else {
            // Si el documento no existe, creamos el usuario en Firestore.
            // Regla especial: si es el PRIMER usuario en la colección, es Admin. Si no, es User.
            const usersRef = collection(db, "Users");
            const q = query(usersRef, limit(1));
            const querySnapshot = await getDocs(q);
            const isFirstUser = querySnapshot.empty;
            const newRole = isFirstUser ? "admin" : "user";

            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email || "",
              displayName: currentUser.displayName || "",
              photoURL: currentUser.photoURL || "",
              role: newRole,
              createdAt: new Date().toISOString(),
            });
            setRole(newRole);
          }
        } catch (error) {
          console.error("Error al obtener o guardar el rol del usuario:", error);
          setRole("user"); // fallback seguro
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
