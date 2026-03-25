import { OrderRepository } from "../../infrastructure/repositories/OrderRepository";
import { OrderResponseDTO } from "../dtos/orderDTO";

export class GetOrderByIdUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: string): Promise<OrderResponseDTO | null> {
    const order = await this.orderRepository.findById(id);
    if (!order) return null;

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
