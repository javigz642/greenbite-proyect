"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOrderByIdUseCase = void 0;
class GetOrderByIdUseCase {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    async execute(id) {
        const order = await this.orderRepository.findById(id);
        if (!order)
            return null;
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
exports.GetOrderByIdUseCase = GetOrderByIdUseCase;
