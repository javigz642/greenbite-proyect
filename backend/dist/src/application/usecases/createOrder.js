"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderUseCase = void 0;
const order_1 = require("../../domain/order");
const generateId = () => {
    return `order-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};
class CreateOrderUseCase {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    async execute(input) {
        const order = new order_1.Order({
            id: generateId(),
            customerName: input.customerName,
            items: input.items
        });
        await this.orderRepository.save(order);
        const json = order.toJSON();
        return {
            id: json.id,
            customerName: json.customerName,
            items: json.items,
            status: json.status,
            createdAt: json.createdAt.toISOString(),
            updatedAt: json.updatedAt.toISOString()
        };
    }
}
exports.CreateOrderUseCase = CreateOrderUseCase;
