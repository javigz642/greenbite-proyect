import { OrderStatus } from "./orderStatus";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
}

export interface OrderProps {
  id: string;
  customerName: string;
  items: OrderItem[];
  status?: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Order {
  private _id: string;
  private _customerName: string;
  private _items: OrderItem[];
  private _status: OrderStatus;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: OrderProps) {
    if (!props.customerName) {
      throw new Error("Customer name is required");
    }

    if (!props.items || props.items.length === 0) {
      throw new Error("Order must have at least one item");
    }

    this._id = props.id;
    this._customerName = props.customerName;
    this._items = props.items;
    this._status = props.status ?? OrderStatus.CREATED;
    const now = new Date();
    this._createdAt = props.createdAt ?? now;
    this._updatedAt = props.updatedAt ?? now;
  }

  get id(): string {
    return this._id;
  }

  get customerName(): string {
    return this._customerName;
  }

  get items(): OrderItem[] {
    return this._items;
  }

  get status(): OrderStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Máquina de estados: define transiciones válidas
  private static readonly allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.CREATED]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    [OrderStatus.CONFIRMED]: [OrderStatus.IN_PREPARATION, OrderStatus.CANCELLED],
    [OrderStatus.IN_PREPARATION]: [OrderStatus.READY, OrderStatus.CANCELLED],
    [OrderStatus.READY]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELLED]: []
  };

  canTransitionTo(nextStatus: OrderStatus): boolean {
    const allowed = Order.allowedTransitions[this._status];
    return allowed.includes(nextStatus);
  }

  changeStatus(nextStatus: OrderStatus): void {
    if (!this.canTransitionTo(nextStatus)) {
      throw new Error(
        `Invalid status transition from ${this._status} to ${nextStatus}`
      );
    }
    this._status = nextStatus;
    this.touch();
  }

  cancel(): void {
    if (!this.canTransitionTo(OrderStatus.CANCELLED)) {
      throw new Error(
        `Cannot cancel order from status ${this._status}`
      );
    }
    this._status = OrderStatus.CANCELLED;
    this.touch();
  }

  private touch(): void {
    this._updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this._id,
      customerName: this._customerName,
      items: this._items,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}
