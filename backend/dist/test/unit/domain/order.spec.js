"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../../../src/domain/order");
const orderStatus_1 = require("../../../src/domain/orderStatus");
describe("Order domain entity", () => {
    const items = [{ id: "1", name: "Menu Vegetariano", quantity: 2 }];
    it("should create an order in CREATED status by default", () => {
        const order = new order_1.Order({
            id: "order-1",
            customerName: "Empresa X",
            items
        });
        expect(order.status).toBe(orderStatus_1.OrderStatus.CREATED);
    });
    it("should not allow empty items", () => {
        expect(() => new order_1.Order({
            id: "order-2",
            customerName: "Empresa X",
            items: []
        })).toThrow("Order must have at least one item");
    });
    it("should allow valid status transitions", () => {
        const order = new order_1.Order({
            id: "order-3",
            customerName: "Empresa X",
            items
        });
        order.changeStatus(orderStatus_1.OrderStatus.CONFIRMED);
        expect(order.status).toBe(orderStatus_1.OrderStatus.CONFIRMED);
        order.changeStatus(orderStatus_1.OrderStatus.IN_PREPARATION);
        expect(order.status).toBe(orderStatus_1.OrderStatus.IN_PREPARATION);
    });
    it("should prevent invalid status transitions", () => {
        const order = new order_1.Order({
            id: "order-4",
            customerName: "Empresa X",
            items
        });
        expect(() => order.changeStatus(orderStatus_1.OrderStatus.READY)).toThrow("Invalid status transition from CREATED to READY");
    });
    it("should allow cancel from CREATED", () => {
        const order = new order_1.Order({
            id: "order-5",
            customerName: "Empresa X",
            items
        });
        order.cancel();
        expect(order.status).toBe(orderStatus_1.OrderStatus.CANCELLED);
    });
});
