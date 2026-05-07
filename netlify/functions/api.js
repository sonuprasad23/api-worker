const express = require("express");
const serverless = require("serverless-http");
const admin = require("firebase-admin");
const cors = require("cors");
const fetch = require("node-fetch");
const {v4: uuidv4} = require("uuid");

// ── Firebase Admin init ───────────────────────────────────────────────────────
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// ── Express app ───────────────────────────────────────────────────────────────
const app = express();
const router = express.Router();

app.use(cors({origin: true}));
app.use(express.json());

const CHATGPT_WORKER_URL = process.env.CHATGPT_WORKER_URL;
const GOOGLE_WORKER_URL = process.env.GOOGLE_WORKER_URL;
const INTERNAL_SECRET = process.env.INTERNAL_SECRET;

// ── Helpers ───────────────────────────────────────────────────────────────────
async function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({error: "Unauthorized"});
  }
  try {
    const token = auth.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    req.uid = decoded.uid;
    next();
  } catch (e) {
    res.status(401).json({error: "Invalid token"});
  }
}

async function ensureUserExists(uid, email, displayName) {
  const ref = db.collection("users").doc(uid);
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set({
      uid,
      email,
      displayName,
      role: "user",
      apiKey: uuidv4(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      totalCalls: 0,
    });
  }
  return (await ref.get()).data();
}

async function resolveUserByApiKey(apiKey) {
  const snap = await db
      .collection("users")
      .where("apiKey", "==", apiKey)
      .limit(1)
      .get();
  if (snap.empty) return null;
  return snap.docs[0].data();
}

async function proxyToWorker(workerUrl, body) {
  const resp = await fetch(`${workerUrl}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-secret": INTERNAL_SECRET,
    },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`Worker error: ${resp.status}`);
  return resp.json();
}

async function requireSuperadmin(req, res, next) {
  const caller = await db.collection("users").doc(req.uid).get();
  if (!caller.exists || caller.data().role !== "superadmin") {
    return res.status(403).json({error: "Forbidden"});
  }
  next();
}

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post("/auth/login", verifyToken, async (req, res) => {
  const decoded = await admin.auth().getUser(req.uid);
  const user = await ensureUserExists(req.uid, decoded.email, decoded.displayName);
  res.json({user});
});

router.get("/me", verifyToken, async (req, res) => {
  const snap = await db.collection("users").doc(req.uid).get();
  if (!snap.exists) return res.status(404).json({error: "User not found"});
  res.json({user: snap.data()});
});

// ── Bearer-token queries ──────────────────────────────────────────────────────
router.post("/query/chatgpt", verifyToken, async (req, res) => {
  const {system_prompt, question} = req.body;
  if (!question) return res.status(400).json({error: "question required"});

  const userRef = db.collection("users").doc(req.uid);
  const logRef = db.collection("usage_logs").doc();

  try {
    const data = await proxyToWorker(CHATGPT_WORKER_URL, {system_prompt, question});
    await userRef.update({totalCalls: admin.firestore.FieldValue.increment(1)});
    await logRef.set({
      uid: req.uid,
      source: "chatgpt",
      question,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      success: true,
    });
    res.json(data);
  } catch (err) {
    await logRef.set({
      uid: req.uid,
      source: "chatgpt",
      question,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      success: false,
      error: err.message,
    });
    res.status(502).json({error: "Worker failed", detail: err.message});
  }
});

router.post("/query/google", verifyToken, async (req, res) => {
  const {system_prompt, question} = req.body;
  if (!question) return res.status(400).json({error: "question required"});

  const userRef = db.collection("users").doc(req.uid);
  const logRef = db.collection("usage_logs").doc();

  try {
    const data = await proxyToWorker(GOOGLE_WORKER_URL, {system_prompt, question});
    await userRef.update({totalCalls: admin.firestore.FieldValue.increment(1)});
    await logRef.set({
      uid: req.uid,
      source: "google",
      question,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      success: true,
    });
    res.json(data);
  } catch (err) {
    await logRef.set({
      uid: req.uid,
      source: "google",
      question,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      success: false,
      error: err.message,
    });
    res.status(502).json({error: "Worker failed", detail: err.message});
  }
});

// ── API-key queries ───────────────────────────────────────────────────────────
router.post("/query/chatgpt/apikey", async (req, res) => {
  const {api_key, system_prompt, question} = req.body;
  if (!api_key || !question) {
    return res.status(400).json({error: "api_key and question required"});
  }
  const user = await resolveUserByApiKey(api_key);
  if (!user) return res.status(403).json({error: "Invalid API key"});

  try {
    const data = await proxyToWorker(CHATGPT_WORKER_URL, {system_prompt, question});
    await db.collection("users").doc(user.uid).update({
      totalCalls: admin.firestore.FieldValue.increment(1),
    });
    res.json(data);
  } catch (err) {
    res.status(502).json({error: "Worker failed", detail: err.message});
  }
});

router.post("/query/google/apikey", async (req, res) => {
  const {api_key, system_prompt, question} = req.body;
  if (!api_key || !question) {
    return res.status(400).json({error: "api_key and question required"});
  }
  const user = await resolveUserByApiKey(api_key);
  if (!user) return res.status(403).json({error: "Invalid API key"});

  try {
    const data = await proxyToWorker(GOOGLE_WORKER_URL, {system_prompt, question});
    await db.collection("users").doc(user.uid).update({
      totalCalls: admin.firestore.FieldValue.increment(1),
    });
    res.json(data);
  } catch (err) {
    res.status(502).json({error: "Worker failed", detail: err.message});
  }
});

// ── Admin ─────────────────────────────────────────────────────────────────────
router.get("/admin/users", verifyToken, requireSuperadmin, async (req, res) => {
  const snap = await db.collection("users").orderBy("createdAt", "desc").get();
  res.json({users: snap.docs.map((d) => d.data())});
});

router.patch("/admin/users/:uid/role", verifyToken, requireSuperadmin, async (req, res) => {
  const {role} = req.body;
  if (!["user", "superadmin"].includes(role)) {
    return res.status(400).json({error: "Invalid role"});
  }
  await db.collection("users").doc(req.params.uid).update({role});
  res.json({success: true});
});

router.get("/admin/stats", verifyToken, requireSuperadmin, async (req, res) => {
  const [usersSnap, logsSnap] = await Promise.all([
    db.collection("users").get(),
    db.collection("usage_logs").get(),
  ]);
  const totalUsers = usersSnap.size;
  const totalCalls = logsSnap.size;
  const successCalls = logsSnap.docs.filter((d) => d.data().success).length;
  res.json({totalUsers, totalCalls, successCalls});
});

// Mount router and export handler
app.use("/.netlify/functions/api", router);

module.exports.handler = serverless(app);
