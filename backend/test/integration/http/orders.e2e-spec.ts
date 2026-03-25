import request from "supertest";
import { createApp } from "../../../src/app";
import { orderRepository } from "../../../src/infrastructure/http/routes/orderRoutes";

describe("Orders HTTP API", () => {
  const app = createApp();

  beforeEach(() => {
    // limpiar el repositorio en memoria entre tests
    if ("clear" in orderRepository && typeof (orderRepository as any).clear === "function") {
      (orderRepository as any).clear();
    }
  });

  it("should create an order via HTTP", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({
        customerName: "Empresa Test",
        items: [{ id: "1", name: "Menú diario", quantity: 5 }]
      })
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.customerName).toBe("Empresa Test");
  });

  it("should get an order by id", async () => {
    const createResponse = await request(app)
      .post("/api/orders")
      .send({
        customerName: "Empresa Test",
        items: [{ id: "1", name: "Menú diario", quantity: 5 }]
      })
      .expect(201);

    const id = createResponse.body.id;

    const getResponse = await request(app)
      .get(`/api/orders/${id}`)
      .expect(200);

    expect(getResponse.body.id).toBe(id);
  });

  it("should update order status with valid transition", async () => {
    const createResponse = await request(app)
      .post("/api/orders")
      .send({
        customerName: "Empresa Test",
        items: [{ id: "1", name: "Menú diario", quantity: 5 }]
      })
      .expect(201);

    const id = createResponse.body.id;

    const patchResponse = await request(app)
      .patch(`/api/orders/${id}/status`)
      .send({ status: "CONFIRMED" })
      .expect(200);

    expect(patchResponse.body.status).toBe("CONFIRMED");
  });

  it("should cancel an order", async () => {
    const createResponse = await request(app)
      .post("/api/orders")
      .send({
        customerName: "Empresa Test",
        items: [{ id: "1", name: "Menú diario", quantity: 5 }]
      })
      .expect(201);

    const id = createResponse.body.id;

    const cancelResponse = await request(app)
      .post(`/api/orders/${id}/cancel`)
      .expect(200);

    expect(cancelResponse.body.status).toBe("CANCELLED");
  });
});
