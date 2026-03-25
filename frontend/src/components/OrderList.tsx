import React from "react";
import type { Order, OrderStatus } from "../types/Order";

interface OrderListProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
  onChangeStatus: (id: string, status: OrderStatus) => void;
  onCancel: (id: string) => void;
  onRefresh: () => void;
}

const statusOptions: OrderStatus[] = [
  "CREATED",
  "CONFIRMED",
  "IN_PREPARATION",
  "READY",
  "DELIVERED",
  "CANCELLED",
];

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  loading,
  error,
  onChangeStatus,
  onCancel,
  onRefresh,
}) => {
  return (
    <section style={{ border: "1px solid #ccc", padding: "1rem", marginTop: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
        <h2>Pedidos</h2>
        <button onClick={onRefresh}>Refrescar</button>
      </div>

      {loading && <p>Cargando pedidos...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {orders.length === 0 && !loading && <p>No hay pedidos.</p>}

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ddd",
            padding: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <p>
            <strong>ID:</strong> {order.id}
          </p>
          <p>
            <strong>Cliente:</strong> {order.customerName}
          </p>
          <p>
            <strong>Estado:</strong> {order.status}
          </p>
          <p>
            <strong>Creado:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
          {order.updatedAt && (
            <p>
              <strong>Actualizado:</strong>{" "}
              {new Date(order.updatedAt).toLocaleString()}
            </p>
          )}
          <p>
            <strong>Items:</strong>
          </p>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                {item.productId} - Cantidad: {item.quantity}
              </li>
            ))}
          </ul>

          <div
            style={{
              marginTop: "0.5rem",
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <label>
              Cambiar estado:
              <select
                value={order.status}
                onChange={(e) =>
                  onChangeStatus(order.id, e.target.value as OrderStatus)
                }
                style={{ marginLeft: "0.5rem" }}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <button
              onClick={() => onCancel(order.id)}
              style={{
                backgroundColor: "#f44336",
                color: "#fff",
                border: "none",
                padding: "0.25rem 0.5rem",
              }}
            >
              Cancelar pedido
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};
