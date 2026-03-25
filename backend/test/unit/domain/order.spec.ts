import { Order, OrderItem } from "../../../src/domain/order";
import { OrderStatus } from "../../../src/domain/orderStatus";

describe("Order domain entity", () => {
  const items: OrderItem[] = [{ id: "1", name: "Menu Vegetariano", quantity: 2 }];

  it("should create an order in CREATED status by default", () => {
    const order = new Order({
      id: "order-1",
      customerName: "Empresa X",
      items
    });

    expect(order.status).toBe(OrderStatus.CREATED);
  });

  it("should not allow empty items", () => {
    expect(
      () =>
        new Order({
          id: "order-2",
          customerName: "Empresa X",
          items: []
        })
    ).toThrow("Order must have at least one item");
  });

  it("should allow valid status transitions", () => {
    const order = new Order({
      id: "order-3",
      customerName: "Empresa X",
      items
    });

    order.changeStatus(OrderStatus.CONFIRMED);
    expect(order.status).toBe(OrderStatus.CONFIRMED);

    order.changeStatus(OrderStatus.IN_PREPARATION);
    expect(order.status).toBe(OrderStatus.IN_PREPARATION);
  });

  it("should prevent invalid status transitions", () => {
    const order = new Order({
      id: "order-4",
      customerName: "Empresa X",
      items
    });

    expect(() =>
      order.changeStatus(OrderStatus.READY)
    ).toThrow("Invalid status transition from CREATED to READY");
  });

  it("should allow cancel from CREATED", () => {
    const order = new Order({
      id: "order-5",
      customerName: "Empresa X",
      items
    });

    order.cancel();
    expect(order.status).toBe(OrderStatus.CANCELLED);
  });
});
