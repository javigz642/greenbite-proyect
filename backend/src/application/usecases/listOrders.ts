import { OrderRepository } from "../../infrastructure/repositories/OrderRepository";
import { OrderResponseDTO } from "../dtos/orderDTO";

export class ListOrdersUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(): Promise<OrderResponseDTO[]> {
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
