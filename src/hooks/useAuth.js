import { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { loginUser } from "../api";

export function useAuth() {
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        return onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                await loginUser();
                setUser(firebaseUser);
            } else {
                setUser(null);
            }
        });
    }, []);

    const login = () => signInWithPopup(auth, googleProvider);
    const logout = () => signOut(auth);

    return { user, login, logout };
}
