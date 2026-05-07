const BASE = import.meta.env.VITE_API_BASE_URL;

async function getHeaders() {
    const { auth } = await import("./firebase");
    const token = await auth.currentUser?.getIdToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export async function loginUser() {
    const headers = await getHeaders();
    const res = await fetch(`${BASE}/auth/login`, { method: "POST", headers });
    return res.json();
}

export async function getMe() {
    const headers = await getHeaders();
    const res = await fetch(`${BASE}/me`, { headers });
    return res.json();
}

export async function queryLLM(source, system_prompt, question) {
    const headers = await getHeaders();
    const res = await fetch(`${BASE}/query/${source}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ system_prompt, question }),
    });
    return res.json();
}

export async function adminGetUsers() {
    const headers = await getHeaders();
    const res = await fetch(`${BASE}/admin/users`, { headers });
    return res.json();
}

export async function adminGetStats() {
    const headers = await getHeaders();
    const res = await fetch(`${BASE}/admin/stats`, { headers });
    return res.json();
}

export async function adminSetRole(uid, role) {
    const headers = await getHeaders();
    const res = await fetch(`${BASE}/admin/users/${uid}/role`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ role }),
    });
    return res.json();
}
