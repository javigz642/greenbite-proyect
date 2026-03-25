"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../src/app");
const orderRoutes_1 = require("../../../src/infrastructure/http/routes/orderRoutes");
describe("Orders HTTP API", () => {
    const app = (0, app_1.createApp)();
    beforeEach(() => {
        // limpiar el repositorio en memoria entre tests
        if ("clear" in orderRoutes_1.orderRepository && typeof orderRoutes_1.orderRepository.clear === "function") {
            orderRoutes_1.orderRepository.clear();
        }
    });
    it("should create an order via HTTP", async () => {
        const response = await (0, supertest_1.default)(app)
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
        const createResponse = await (0, supertest_1.default)(app)
            .post("/api/orders")
            .send({
            customerName: "Empresa Test",
            items: [{ id: "1", name: "Menú diario", quantity: 5 }]
        })
            .expect(201);
        const id = createResponse.body.id;
        const getResponse = await (0, supertest_1.default)(app)
            .get(`/api/orders/${id}`)
            .expect(200);
        expect(getResponse.body.id).toBe(id);
    });
    it("should update order status with valid transition", async () => {
        const createResponse = await (0, supertest_1.default)(app)
            .post("/api/orders")
            .send({
            customerName: "Empresa Test",
            items: [{ id: "1", name: "Menú diario", quantity: 5 }]
        })
            .expect(201);
        const id = createResponse.body.id;
        const patchResponse = await (0, supertest_1.default)(app)
            .patch(`/api/orders/${id}/status`)
            .send({ status: "CONFIRMED" })
            .expect(200);
        expect(patchResponse.body.status).toBe("CONFIRMED");
    });
    it("should cancel an order", async () => {
        const createResponse = await (0, supertest_1.default)(app)
            .post("/api/orders")
            .send({
            customerName: "Empresa Test",
            items: [{ id: "1", name: "Menú diario", quantity: 5 }]
        })
            .expect(201);
        const id = createResponse.body.id;
        const cancelResponse = await (0, supertest_1.default)(app)
            .post(`/api/orders/${id}/cancel`)
            .expect(200);
        expect(cancelResponse.body.status).toBe("CANCELLED");
    });
});
