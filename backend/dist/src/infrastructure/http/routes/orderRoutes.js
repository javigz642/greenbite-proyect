"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRepository = exports.orderRoutes = void 0;
const express_1 = require("express");
const InMemoryOrderRepository_1 = require("../../repositories/InMemoryOrderRepository");
const createOrder_1 = require("../../../application/usecases/createOrder");
const getOrderById_1 = require("../../../application/usecases/getOrderById");
const listOrders_1 = require("../../../application/usecases/listOrders");
const updateOrderStatus_1 = require("../../../application/usecases/updateOrderStatus");
const cancelOrder_1 = require("../../../application/usecases/cancelOrder");
const orderStatus_1 = require("../../../domain/orderStatus");
const router = (0, express_1.Router)();
exports.orderRoutes = router;
// En un sistema real esto se inyectaría, aquí lo simplificamos:
const orderRepository = new InMemoryOrderRepository_1.InMemoryOrderRepository();
exports.orderRepository = orderRepository;
const createOrderUseCase = new createOrder_1.CreateOrderUseCase(orderRepository);
const getOrderByIdUseCase = new getOrderById_1.GetOrderByIdUseCase(orderRepository);
const listOrdersUseCase = new listOrders_1.ListOrdersUseCase(orderRepository);
const updateOrderStatusUseCase = new updateOrderStatus_1.UpdateOrderStatusUseCase(orderRepository);
const cancelOrderUseCase = new cancelOrder_1.CancelOrderUseCase(orderRepository);
router.post("/orders", async (req, res) => {
    try {
        const { customerName, items } = req.body;
        const result = await createOrderUseCase.execute({ customerName, items });
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.get("/orders/:id", async (req, res) => {
    const { id } = req.params;
    const result = await getOrderByIdUseCase.execute(id);
    if (!result) {
        return res.status(404).json({ message: "Order not found" });
    }
    res.json(result);
});
router.get("/orders", async (_req, res) => {
    const result = await listOrdersUseCase.execute();
    res.json(result);
});
router.patch("/orders/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!Object.values(orderStatus_1.OrderStatus).includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }
    try {
        const result = await updateOrderStatusUseCase.execute(id, status);
        res.json(result);
    }
    catch (error) {
        if (error.message === "Order not found") {
            return res.status(404).json({ message: error.message });
        }
        return res.status(400).json({ message: error.message });
    }
});
router.post("/orders/:id/cancel", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await cancelOrderUseCase.execute(id);
        res.json(result);
    }
    catch (error) {
        if (error.message === "Order not found") {
            return res.status(404).json({ message: error.message });
        }
        return res.status(400).json({ message: error.message });
    }
});
