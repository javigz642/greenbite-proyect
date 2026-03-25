import React, { useState } from "react";

interface CreateOrderFormProps {
  onCreate: (data: {
    customerName: string;
    items: { productId: string; quantity: number }[];
  }) => Promise<void>;
}

interface ItemForm {
  productId: string;
  quantity: number;
}

export const CreateOrderForm: React.FC<CreateOrderFormProps> = ({ onCreate }) => {
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState<ItemForm[]>([
    { productId: "", quantity: 1 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleItemChange = (
    index: number,
    field: "productId" | "quantity",
    value: string
  ) => {
    const newItems = [...items];
    if (field === "quantity") {
      const parsed = parseInt(value, 10);
      newItems[index].quantity = isNaN(parsed) ? 0 : parsed;
    } else {
      newItems[index].productId = value;
    }
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { productId: "", quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();
    setError(null);

    const validItems = items.filter(
      (item) => item.productId.trim() !== "" && item.quantity > 0
    );

    if (customerName.trim() === "") {
      setError("El nombre de cliente es obligatorio.");
      return;
    }

    if (validItems.length === 0) {
      setError("Debe haber al menos un item válido.");
      return;
    }

    try {
      setLoading(true);
      await onCreate({
        customerName: customerName.trim(),
        items: validItems,
      });
      // Limpiar formulario al crear
      setCustomerName("");
      setItems([{ productId: "", quantity: 1 }]);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Error desconocido al crear el pedido.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ border: "1px solid #ccc", padding: "1rem" }}>
      <h2>Crear pedido</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            Nombre cliente:
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <p>Items:</p>
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                marginBottom: "0.25rem",
              }}
            >
              <input
                type="text"
                placeholder="productId"
                value={item.productId}
                onChange={(e) =>
                  handleItemChange(index, "productId", e.target.value)
                }
              />
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
              />
              <button type="button" onClick={() => handleRemoveItem(index)}>
                -
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddItem}>
            Añadir item
          </button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear pedido"}
        </button>
      </form>
    </section>
  );
};
