import { Order } from "../../domain/order";
import { OrderRepository } from "../../infrastructure/repositories/OrderRepository";
import { CreateOrderDTO, OrderResponseDTO } from "../dtos/orderDTO";

const generateId = (): string => {
  return `order-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export class CreateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(input: CreateOrderDTO): Promise<OrderResponseDTO> {
    const order = new Order({
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
