const express = require("express");
const swaggerUi = require("swagger-ui-express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const customers = [
  { id: 1, name: "Aurora Finance", plan: "Enterprise", region: "EU" },
  { id: 2, name: "MossGrid Health", plan: "Growth", region: "India" },
  { id: 3, name: "OrbitLeaf Retail", plan: "Starter", region: "US" }
];

const workspaces = [
  { id: "ws_001", customerId: 1, name: "Core Banking Workspace", status: "active" },
  { id: "ws_002", customerId: 2, name: "Patient Experience Workspace", status: "active" },
  { id: "ws_003", customerId: 3, name: "Retail Ops Workspace", status: "trial" }
];

const apis = [
  { id: "api_001", workspaceId: "ws_001", name: "Payments API", environment: "production", score: 91 },
  { id: "api_002", workspaceId: "ws_002", name: "Appointments API", environment: "staging", score: 84 },
  { id: "api_003", workspaceId: "ws_003", name: "Inventory API", environment: "production", score: 72 }
];

const deployments = [
  { id: "dep_001", apiId: "api_001", version: "v1.4.2", status: "successful" },
  { id: "dep_002", apiId: "api_002", version: "v2.1.0", status: "successful" },
  { id: "dep_003", apiId: "api_003", version: "v1.0.8", status: "failed" }
];

const agents = [
  { id: "agent_001", name: "Policy Scanner", status: "active", task: "governance" },
  { id: "agent_002", name: "Security Sentinel", status: "active", task: "threat detection" },
  { id: "agent_003", name: "Latency Watcher", status: "paused", task: "performance" }
];

const events = [
  { id: "evt_001", type: "api.created", source: "Payments API", severity: "info" },
  { id: "evt_002", type: "deployment.failed", source: "Inventory API", severity: "warning" },
  { id: "evt_003", type: "security.anomaly", source: "Appointments API", severity: "critical" }
];

const subscriptions = [
  { id: "sub_001", customerId: 1, plan: "Enterprise", status: "active" },
  { id: "sub_002", customerId: 2, plan: "Growth", status: "trialing" },
  { id: "sub_003", customerId: 3, plan: "Starter", status: "cancelled" }
];

const billing = [
  { id: "bill_001", customerId: 1, amount: 24000, currency: "USD", status: "paid" },
  { id: "bill_002", customerId: 2, amount: 7200, currency: "USD", status: "open" },
  { id: "bill_003", customerId: 3, amount: 999, currency: "USD", status: "overdue" }
];

const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "NeonBanyan Platform API",
    version: "1.0.0",
    description: "API contract for NeonBanyan's demo platform."
  },
  paths: {
    "/health": { get: { summary: "Health check", responses: { "200": { description: "OK" } } } },
    "/customers": { get: { summary: "List customers", responses: { "200": { description: "OK" } } } },
    "/customers/{id}": { get: { summary: "Get customer by ID", responses: { "200": { description: "OK" }, "404": { description: "Customer not found" } } } },
    "/workspaces": { get: { summary: "List workspaces", responses: { "200": { description: "OK" } } } },
    "/apis": { get: { summary: "List APIs", responses: { "200": { description: "OK" } } } },
    "/deployments": { get: { summary: "List deployments", responses: { "200": { description: "OK" } } } },
    "/agents": { get: { summary: "List agents", responses: { "200": { description: "OK" } } } },
    "/events": { get: { summary: "List events", responses: { "200": { description: "OK" } } } },
    "/subscriptions": { get: { summary: "List subscriptions", responses: { "200": { description: "OK" } } } },
    "/billing": { get: { summary: "List billing records", responses: { "200": { description: "OK" } } } },
    "/auth/login": { post: { summary: "Login user", responses: { "200": { description: "Login successful" }, "400": { description: "Missing email or password" }, "401": { description: "Invalid credentials" } } } },
    "/slow-api": { get: { summary: "Slow API response", responses: { "200": { description: "Delayed response" } } } },
    "/random-error": { get: { summary: "Random 500 error", responses: { "200": { description: "Success" }, "500": { description: "Intentional fake error" } } } }
  }
};

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.get("/", (req, res) => {
  res.json({
    name: "NeonBanyan Platform API",
    version: "1.0.0",
    status: "healthy",
    description: "The unified platform for managing customers, workspaces, APIs, deployments, agents, events, subscriptions, and billing.",
    docs: "/docs",
    openapi: "/openapi.json"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "neonbanyan-platform-api",
    timestamp: new Date().toISOString()
  });
});

app.get("/customers", (req, res) => res.json(customers));

app.get("/customers/:id", (req, res) => {
  const customer = customers.find(c => c.id === Number(req.params.id));

  if (!customer) {
    return res.status(404).json({
      error: "Customer not found",
      customerId: req.params.id
    });
  }

  res.json(customer);
});

app.get("/workspaces", (req, res) => res.json(workspaces));
app.get("/apis", (req, res) => res.json(apis));
app.get("/deployments", (req, res) => res.json(deployments));
app.get("/agents", (req, res) => res.json(agents));
app.get("/events", (req, res) => res.json(events));
app.get("/subscriptions", (req, res) => res.json(subscriptions));
app.get("/billing", (req, res) => res.json(billing));

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (email === "demo@neonbanyan.io" && password === "password123") {
    return res.json({
      token: "fake_neonbanyan_jwt_token_12345",
      user: { id: 1, email, role: "admin" }
    });
  }

  res.status(401).json({ error: "Invalid credentials" });
});

app.get("/slow-api", async (req, res) => {
  await new Promise(resolve => setTimeout(resolve, 3000));

  res.json({
    message: "This response was intentionally delayed by 3 seconds",
    service: "NeonBanyan Platform API"
  });
});

app.get("/random-error", (req, res) => {
  if (Math.random() < 0.35) {
    return res.status(500).json({
      error: "Fake internal server error",
      reason: "Intentional NeonBanyan demo failure"
    });
  }

  res.json({
    message: "No error this time",
    service: "NeonBanyan Platform API"
  });
});

app.get("/openapi.json", (req, res) => {
  res.json(openApiSpec);
});

app.listen(PORT, () => {
  console.log(`NeonBanyan Platform API running on port ${PORT}`);
});
