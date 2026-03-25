import { OrderRepository } from "../../infrastructure/repositories/OrderRepository";
import { OrderResponseDTO } from "../dtos/orderDTO";

export class CancelOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: string): Promise<OrderResponseDTO> {
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
