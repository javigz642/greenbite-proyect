"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelOrderUseCase = void 0;
class CancelOrderUseCase {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    async execute(id) {
        const order = await this.orderRepository.findById(id);
        if (!order) {
            throw new Error("Order not found");
        }
        order.cancel();
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
exports.CancelOrderUseCase = CancelOrderUseCase;
