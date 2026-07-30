require("dotenv").config({
  path: "../.env",
});

const express = require("express");

const app = express();

app.use(express.json());

const PORT = 8080;

const AUTH_USERNAME = process.env.BASIC_USERNAME || "test";

const AUTH_PASSWORD = process.env.BASIC_PASSWORD || "test123";

console.log("AUTH_USERNAME:", AUTH_USERNAME);
console.log("AUTH_PASSWORD:", AUTH_PASSWORD);
// Basic Auth middleware
function basicAuth(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Basic ")) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const base64Credentials = auth.split(" ")[1];

  const credentials = Buffer.from(base64Credentials, "base64").toString();

  const [username, password] = credentials.split(":");

  if (username !== AUTH_USERNAME || password !== AUTH_PASSWORD) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  next();
}

// =======================
// Health Check
// =======================
// Public endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "autopayment-mock-api",
  });
});

// =======================
// Protected routes
// =======================

app.use(basicAuth);

// =======================
// Cron Workers
// GET /crons/get_cron
// =======================

app.get("/crons/get_cron", (req, res) => {
  res.json([
    {
      id: 1,
      title: "daily-worker",
      branches: 10,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      title: "payment-worker",
      branches: 20,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
});

// =======================
// Debtors
// POST /lofs/get_branch_lof
// =======================

app.post("/lofs/get_branch_lof", (req, res) => {
  const { organization_id } = req.body;

  const debtors = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    contract_id: 500000 + index,
    date: "2026-07-01",
    expiration_date: "2027-07-01",
    client_fio: `CLIENT ${index + 1}`,
    client_id: 10000 + index,
    old_id: null,
    collaboration_id: null,
    organization_id,
    payment_type_id: 2951,
    debt: 1250000,
  }));

  res.json(debtors);
});

// =======================
// Test
// GET /test
// =======================

app.get("/test", (req, res) => {
  res.json({
    status: "ok",
    hostname: "mock-container",
  });
});

// =======================
// Organizations
// GET /organizations/get-all-organization
// =======================

app.get("/organizations/get-all-organization", (req, res) => {
  res.json([
    {
      id: 10,
      title: "Chilonzor filiali",
      active: true,
    },
    {
      id: 20,
      title: "Yunusobod filiali",
      active: true,
    },
    {
      id: 30,
      title: "Sergeli filiali",
      active: true,
    },
  ]);
});

// =======================
// Cron Organizations
// GET /organization/get_cron_organization
// =======================

app.get("/organization/get_cron_organization", (req, res) => {
  res.json([
    {
      id: 10,
      title: "Chilonzor filiali",
      active: true,
    },
    {
      id: 20,
      title: "Yunusobod filiali",
      active: true,
    },
  ]);
});

// =======================
// All LOFs
// GET /lofs/get-all-lof
// =======================

app.get("/lofs/get-all-lof", (req, res) => {
  const page = Number(req.query.page || 1);
  const perPage = 20;
  const total = 200;

  const data = Array.from({ length: perPage }, (_, index) => ({
    id: (page - 1) * perPage + index + 1,
    contract_id: 500000 + index,
    client_fio: `CLIENT ${index + 1}`,
    organization_id: 10,
    debt: 1250000,
  }));

  res.json({
    current_page: page,
    per_page: perPage,
    total,
    data,
  });
});

// =======================
// Logs
// GET /logs/get-all-log
// =======================

app.get("/logs/get-all-log", (req, res) => {
  const logs = Array.from({ length: 30 }, (_, index) => ({
    id: index + 1,
    type: "payment",
    status: "SUCCESS",
    request_url: "/payments/payment-one",
    created_at: new Date(),
  }));

  res.json({
    current_page: 1,
    total: logs.length,
    data: logs,
  });
});

// =======================
// Organization Cycles
// GET /organization_cycles/organization-cycle
// =======================

app.get("/organization_cycles/organization-cycle", (req, res) => {
  res.json({
    current_page: 1,
    total: 3,
    data: [
      {
        id: 10,
        title: "Chilonzor filiali",
        cycle_count: 24,
        transaction_sum: 18450000,
      },
      {
        id: 20,
        title: "Yunusobod filiali",
        cycle_count: 18,
        transaction_sum: 9200000,
      },
      {
        id: 30,
        title: "Sergeli filiali",
        cycle_count: 12,
        transaction_sum: 4500000,
      },
    ],
  });
});

// =======================
// Cards
// =======================

// POST /cards/register
app.post("/cards/register", (req, res) => {
  const { contract_id, card_number, expire } = req.body;

  res.json({
    message: "SMS yuborildi +99890***1234",
    success: true,
    data: {
      session: 8891234,
      otpSentPhone: "+99890***1234",
    },
  });
});

// POST /cards/confirm
app.post("/cards/confirm", (req, res) => {
  const { session, otp } = req.body;

  if (!otp) {
    return res.status(400).json({
      message: "Noto'g'ri OTP(-3)",
      success: false,
    });
  }

  res.json({
    message: "Muvaffaqiyatli bajarildi",
    success: true,
  });
});

// POST /cards/delete
app.post("/cards/delete", (req, res) => {
  const { user_card_id } = req.body;

  res.json({
    message: "Muvaffaqiyatli bajarildi",
    success: true,
  });
});

// GET /cards/get-cards/:contractId

app.get("/cards/get-cards/:contractId", (req, res) => {
  const contractId = req.params.contractId;

  res.json({
    data: [
      {
        id: 1,
        contract_id: contractId,
        user_card_id: 445566,
        expire: "09/28",
        owner: "AZIZ AZIZOV",
        card_number_mask: "8600********1234",
        status: 0,
        created_at: new Date(),
      },
    ],
  });
});

// =======================
// Payments
// =======================

// POST /payments/payment-one

app.post("/payments/payment-one", (req, res) => {
  const { lof_id } = req.body;

  if (!lof_id) {
    return res.status(400).json({
      message: "Bunday Lof id mavjud emas!",
    });
  }

  res.status(200).send();
});

// POST /payments/reverse

app.post("/payments/reverse", (req, res) => {
  const { transaction_id } = req.body;

  res.json({
    message: "Ushbu to'lov muvaffaqiyatli qaytarildi",
    success: true,
  });
});

// =======================
// PWR
// =======================

// POST /pwr/get-sms

app.post("/pwr/get-sms", (req, res) => {
  const { amount, card_number, contract_id } = req.body;

  res.json({
    result: {
      session: 8891234,
      otpSentPhone: "+99890***1234",
    },

    error: null,
  });
});

// POST /pwr/confirm

app.post("/pwr/confirm", (req, res) => {
  const { otp, session } = req.body;

  if (!otp || !session) {
    return res.status(400).json({
      message: "OTP yoki session noto'g'ri",
    });
  }

  res.json({
    success: true,
  });
});

// =======================
// Server
// =======================

app.listen(PORT, () => {
  console.log(`Mock API running on port ${PORT}`);
});
