import React, { useEffect, useState } from "react";
import type { Order, OrderStatus } from "./types/Order";
import {
  fetchOrders,
  createOrder,
  updateOrderStatus,
  cancelOrder,
} from "./services/api";
import { OrderList } from "./components/OrderList";
import { CreateOrderForm } from "./components/CreateOrderForm";

const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Error desconocido al cargar los pedidos.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCreateOrder = async (data: {
    customerName: string;
    items: { productId: string; quantity: number }[];
  }) => {
    await createOrder(data);
    await loadOrders();
  };

  const handleChangeStatus = async (id: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(id, status);
      await loadOrders();
    } catch (e) {
      if (e instanceof Error) {
        alert(`Error al actualizar estado: ${e.message}`);
      } else {
        alert("Error desconocido al actualizar el estado.");
      }
    }
  };

  const handleCancelOrder = async (id: string) => {
    const confirmCancel = window.confirm(
      "¿Seguro que deseas cancelar este pedido?"
    );
    if (!confirmCancel) return;

    try {
      await cancelOrder(id);
      await loadOrders();
    } catch (e) {
      if (e instanceof Error) {
        alert(`Error al cancelar pedido: ${e.message}`);
      } else {
        alert("Error desconocido al cancelar el pedido.");
      }
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
      <h1>GreenBite Catering - Gestión de Pedidos</h1>

      <CreateOrderForm onCreate={handleCreateOrder} />

      <OrderList
        orders={orders}
        loading={loading}
        error={error}
        onChangeStatus={handleChangeStatus}
        onCancel={handleCancelOrder}
        onRefresh={loadOrders}
      />
    </div>
  );
};

export default App;
