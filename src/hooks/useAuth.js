import { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { loginUser } from "../api";

export function useAuth() {
    const [user, setUser] = useState(undefined);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        return onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    await loginUser();
                } catch (e) {
                    console.error("Backend login failed:", e);
                }
                setUser(firebaseUser);
            } else {
                setUser(null);
            }
        });
    }, []);

    const login = async () => {
        setAuthError(null);
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (e) {
            console.error("Sign-in error:", e);
            if (e.code === "auth/popup-blocked") {
                setAuthError("Popup was blocked. Please allow popups for this site.");
            } else if (e.code === "auth/unauthorized-domain") {
                setAuthError("This domain is not authorized. Add it in Firebase Console.");
            } else {
                setAuthError(e.message || "Sign-in failed. Try again.");
            }
        }
    };

    const logout = () => signOut(auth);

    return { user, login, logout, authError };
}
