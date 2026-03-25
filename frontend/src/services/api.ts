import type { Order, OrderStatus } from "../types/Order";

// Ajusta si cambias la URL del backend
// Backend expone las rutas como /api/orders, /api/orders/:id, etc.
const API_BASE_URL = "http://localhost:3000/api";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Error ${response.status}`;
    try {
      const data = await response.json();
      if (data && typeof (data as any).message === "string") {
        message = (data as any).message;
      }
    } catch {
      // ignorar error al parsear
    }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export async function fetchOrders(): Promise<Order[]> {
  const response = await fetch(`${API_BASE_URL}/orders`);
  return handleResponse<Order[]>(response);
}

interface CreateOrderPayload {
  customerName: string;
  items: { productId: string; quantity: number }[];
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<Order>(response);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  return handleResponse<Order>(response);
}

// frontend/src/services/api.ts
export async function cancelOrder(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
    method: "POST",
  });

  if (!response.ok) {
    let message = `Error ${response.status}`;
    try {
      const data = await response.json();
      if (data && typeof (data as any).message === "string") {
        message = (data as any).message;
      }
    } catch {
      // ignorar
    }
    throw new Error(message);
  }
}

