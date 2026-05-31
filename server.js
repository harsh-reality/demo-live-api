const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const customers = [
  { id: 1, name: "Acme Bank", plan: "Enterprise", region: "EU" },
  { id: 2, name: "Nova Health", plan: "Team", region: "India" },
  { id: 3, name: "Orbit Retail", plan: "Starter", region: "US" }
];

const orders = [
  { id: 101, customerId: 1, amount: 12000, status: "paid" },
  { id: 102, customerId: 2, amount: 4500, status: "pending" },
  { id: 103, customerId: 3, amount: 999, status: "failed" }
];

app.get("/", (req, res) => {
  res.json({
    message: "Fake Live API is running",
    openapi: "/openapi.json",
    endpoints: ["/health", "/customers", "/customers/1", "/orders", "/random-error"]
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/customers", (req, res) => {
  res.json(customers);
});

app.get("/customers/:id", (req, res) => {
  const customer = customers.find(c => c.id === Number(req.params.id));

  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  res.json(customer);
});

app.get("/orders", (req, res) => {
  res.json(orders);
});

app.post("/orders", (req, res) => {
  const order = {
    id: Math.floor(Math.random() * 100000),
    customerId: req.body.customerId || 1,
    amount: req.body.amount || 1000,
    status: "paid"
  };

  orders.push(order);
  res.status(201).json(order);
});

app.get("/random-error", (req, res) => {
  if (Math.random() < 0.35) {
    return res.status(500).json({
      error: "Fake internal server error",
      reason: "Intentional demo failure"
    });
  }

  res.json({ message: "No error this time" });
});

app.get("/openapi.json", (req, res) => {
  res.json({
    openapi: "3.0.0",
    info: {
      title: "Fake Live API",
      version: "1.0.0"
    },
    paths: {
      "/health": {
        get: {
          summary: "Health check",
          responses: {
            "200": { description: "API is healthy" }
          }
        }
      },
      "/customers": {
        get: {
          summary: "List customers",
          responses: {
            "200": { description: "List of customers" }
          }
        }
      },
      "/customers/{id}": {
        get: {
          summary: "Get customer by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" }
            }
          ],
          responses: {
            "200": { description: "Customer found" },
            "404": { description: "Customer not found" }
          }
        }
      },
      "/orders": {
        get: {
          summary: "List orders",
          responses: {
            "200": { description: "List of orders" }
          }
        },
        post: {
          summary: "Create order",
          responses: {
            "201": { description: "Order created" }
          }
        }
      },
      "/random-error": {
        get: {
          summary: "Randomly returns success or 500 error",
          responses: {
            "200": { description: "Success" },
            "500": { description: "Intentional fake error" }
          }
        }
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
