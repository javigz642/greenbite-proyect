"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const orderStatus_1 = require("./orderStatus");
class Order {
    constructor(props) {
        if (!props.customerName) {
            throw new Error("Customer name is required");
        }
        if (!props.items || props.items.length === 0) {
            throw new Error("Order must have at least one item");
        }
        this._id = props.id;
        this._customerName = props.customerName;
        this._items = props.items;
        this._status = props.status ?? orderStatus_1.OrderStatus.CREATED;
        const now = new Date();
        this._createdAt = props.createdAt ?? now;
        this._updatedAt = props.updatedAt ?? now;
    }
    get id() {
        return this._id;
    }
    get customerName() {
        return this._customerName;
    }
    get items() {
        return this._items;
    }
    get status() {
        return this._status;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    canTransitionTo(nextStatus) {
        const allowed = Order.allowedTransitions[this._status];
        return allowed.includes(nextStatus);
    }
    changeStatus(nextStatus) {
        if (!this.canTransitionTo(nextStatus)) {
            throw new Error(`Invalid status transition from ${this._status} to ${nextStatus}`);
        }
        this._status = nextStatus;
        this.touch();
    }
    cancel() {
        if (!this.canTransitionTo(orderStatus_1.OrderStatus.CANCELLED)) {
            throw new Error(`Cannot cancel order from status ${this._status}`);
        }
        this._status = orderStatus_1.OrderStatus.CANCELLED;
        this.touch();
    }
    touch() {
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
exports.Order = Order;
// Máquina de estados: define transiciones válidas
Order.allowedTransitions = {
    [orderStatus_1.OrderStatus.CREATED]: [orderStatus_1.OrderStatus.CONFIRMED, orderStatus_1.OrderStatus.CANCELLED],
    [orderStatus_1.OrderStatus.CONFIRMED]: [orderStatus_1.OrderStatus.IN_PREPARATION, orderStatus_1.OrderStatus.CANCELLED],
    [orderStatus_1.OrderStatus.IN_PREPARATION]: [orderStatus_1.OrderStatus.READY, orderStatus_1.OrderStatus.CANCELLED],
    [orderStatus_1.OrderStatus.READY]: [orderStatus_1.OrderStatus.DELIVERED, orderStatus_1.OrderStatus.CANCELLED],
    [orderStatus_1.OrderStatus.DELIVERED]: [],
    [orderStatus_1.OrderStatus.CANCELLED]: []
};
