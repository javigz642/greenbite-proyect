import { Order } from "../../domain/order";
import { OrderRepository } from "./OrderRepository";

export class InMemoryOrderRepository implements OrderRepository {
  private orders: Map<string, Order> = new Map();

  async save(order: Order): Promise<void> {
    this.orders.set(order.id, order);
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.get(id) ?? null;
  }

  async findAll(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  // Método solo para tests
  clear(): void {
    this.orders.clear();
  }
}
