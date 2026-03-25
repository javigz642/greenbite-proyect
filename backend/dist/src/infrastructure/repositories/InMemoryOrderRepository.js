"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryOrderRepository = void 0;
class InMemoryOrderRepository {
    constructor() {
        this.orders = new Map();
    }
    async save(order) {
        this.orders.set(order.id, order);
    }
    async findById(id) {
        return this.orders.get(id) ?? null;
    }
    async findAll() {
        return Array.from(this.orders.values());
    }
    // Método solo para tests
    clear() {
        this.orders.clear();
    }
}
exports.InMemoryOrderRepository = InMemoryOrderRepository;
