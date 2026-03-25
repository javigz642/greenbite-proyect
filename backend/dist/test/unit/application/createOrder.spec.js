"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createOrder_1 = require("../../../src/application/usecases/createOrder");
class InMemoryOrderRepositoryStub {
    constructor() {
        this.savedOrders = [];
    }
    async save(order) {
        this.savedOrders.push(order);
    }
    async findById(_id) {
        return null;
    }
    async findAll() {
        return this.savedOrders;
    }
}
describe("CreateOrderUseCase", () => {
    it("should create and persist an order", async () => {
        const repo = new InMemoryOrderRepositoryStub();
        const useCase = new createOrder_1.CreateOrderUseCase(repo);
        const result = await useCase.execute({
            customerName: "Empresa Y",
            items: [{ id: "1", name: "Buffet", quantity: 10 }]
        });
        expect(result.id).toBeDefined();
        expect(result.customerName).toBe("Empresa Y");
        expect(repo.savedOrders.length).toBe(1);
        expect(repo.savedOrders[0].id).toBe(result.id);
    });
});
