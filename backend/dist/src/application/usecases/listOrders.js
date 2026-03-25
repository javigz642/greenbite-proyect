"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListOrdersUseCase = void 0;
class ListOrdersUseCase {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    async execute() {
        const orders = await this.orderRepository.findAll();
        return orders.map((order) => {
            const json = order.toJSON();
            return {
                id: json.id,
                customerName: json.customerName,
                items: json.items,
                status: json.status,
                createdAt: json.createdAt.toISOString(),
                updatedAt: json.updatedAt.toISOString()
            };
        });
    }
}
exports.ListOrdersUseCase = ListOrdersUseCase;
