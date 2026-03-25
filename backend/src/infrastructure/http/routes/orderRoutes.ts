import { Router, Request, Response } from "express";
import { InMemoryOrderRepository } from "../../repositories/InMemoryOrderRepository";
import { CreateOrderUseCase } from "../../../application/usecases/createOrder";
import { GetOrderByIdUseCase } from "../../../application/usecases/getOrderById";
import { ListOrdersUseCase } from "../../../application/usecases/listOrders";
import { UpdateOrderStatusUseCase } from "../../../application/usecases/updateOrderStatus";
import { CancelOrderUseCase } from "../../../application/usecases/cancelOrder";
import { OrderStatus } from "../../../domain/orderStatus";

const router = Router();

// En un sistema real esto se inyectaría, aquí lo simplificamos:
const orderRepository = new InMemoryOrderRepository();

const createOrderUseCase = new CreateOrderUseCase(orderRepository);
const getOrderByIdUseCase = new GetOrderByIdUseCase(orderRepository);
const listOrdersUseCase = new ListOrdersUseCase(orderRepository);
const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository);
const cancelOrderUseCase = new CancelOrderUseCase(orderRepository);

router.post("/orders", async (req: Request, res: Response) => {
  try {
    const { customerName, items } = req.body;
    const result = await createOrderUseCase.execute({ customerName, items });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/orders/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getOrderByIdUseCase.execute(id);
  if (!result) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.json(result);
});

router.get("/orders", async (_req: Request, res: Response) => {
  const result = await listOrdersUseCase.execute();
  res.json(result);
});

router.patch("/orders/:id/status", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!Object.values(OrderStatus).includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const result = await updateOrderStatusUseCase.execute(id, status);
    res.json(result);
  } catch (error: any) {
    if (error.message === "Order not found") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(400).json({ message: error.message });
  }
});

router.post("/orders/:id/cancel", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await cancelOrderUseCase.execute(id);
    res.json(result);
  } catch (error: any) {
    if (error.message === "Order not found") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(400).json({ message: error.message });
  }
});

export { router as orderRoutes, orderRepository };
