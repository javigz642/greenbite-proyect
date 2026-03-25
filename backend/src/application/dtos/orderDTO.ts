import { OrderStatus } from "../../domain/orderStatus";
import { OrderItem } from "../../domain/order";

export interface CreateOrderDTO {
  customerName: string;
  items: OrderItem[];
}

export interface OrderResponseDTO {
  id: string;
  customerName: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
