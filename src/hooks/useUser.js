import { useState, useEffect } from "react";
import { getMe } from "../api";

export function useUser(firebaseUser) {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (!firebaseUser) return;
        getMe().then((d) => setProfile(d.user));
    }, [firebaseUser]);

    return profile;
}
