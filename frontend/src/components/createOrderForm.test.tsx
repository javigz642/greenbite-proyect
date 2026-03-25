import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateOrderForm } from './CreateOrderForm';

describe('CreateOrderForm', () => {
  test('muestra errores de validación cuando faltan datos', async () => {
    const onCreate = jest.fn().mockResolvedValue(undefined);
    render(<CreateOrderForm onCreate={onCreate} />);

    const user = userEvent.setup();

    const submitButton = screen.getByRole('button', {
      name: /Crear pedido/i,
    });

    await user.click(submitButton);

    expect(
      await screen.findByText(/El nombre de cliente es obligatorio/i),
    ).toBeInTheDocument();

    // Introducimos nombre pero sin items válidos
    const nameInput = screen.getByLabelText(/Nombre cliente:/i);
    await user.type(nameInput, 'Cliente Test');

    await user.click(submitButton);

    expect(
      await screen.findByText(/Debe haber al menos un item válido/i),
    ).toBeInTheDocument();
  });

  test('llama a onCreate con datos válidos y limpia el formulario', async () => {
    const onCreate = jest.fn().mockResolvedValue(undefined);
    render(<CreateOrderForm onCreate={onCreate} />);

    const user = userEvent.setup();

    const nameInput = screen.getByLabelText(/Nombre cliente:/i);
    await user.type(nameInput, 'Cliente Test');

    const productInput = screen.getByPlaceholderText(/productId/i);
    await user.type(productInput, 'PROD-1');

    const qtyInput = screen.getByDisplayValue('1');
    await user.clear(qtyInput);
    await user.type(qtyInput, '2');

    const submitButton = screen.getByRole('button', {
      name: /Crear pedido/i,
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(onCreate).toHaveBeenCalledTimes(1);
      expect(onCreate).toHaveBeenCalledWith({
        customerName: 'Cliente Test',
        items: [{ productId: 'PROD-1', quantity: 2 }],
      });
    });

    // Comprobar que el formulario se ha limpiado
    expect(nameInput).toHaveValue('');
    expect(productInput).toHaveValue('');
    expect(qtyInput).toHaveValue(1);
  });

  test('permite añadir y eliminar items', async () => {
    const onCreate = jest.fn().mockResolvedValue(undefined);
    render(<CreateOrderForm onCreate={onCreate} />);

    const user = userEvent.setup();

    const addItemButton = screen.getByRole('button', {
      name: /Añadir item/i,
    });

    await user.click(addItemButton);

    // Debe haber ahora al menos dos inputs de productId
    const productInputs = screen.getAllByPlaceholderText(/productId/i);
    expect(productInputs.length).toBeGreaterThanOrEqual(2);

    const removeButtons = screen.getAllByRole('button', { name: '-' });
    // Eliminamos el segundo item
    await user.click(removeButtons[1]);

    const productInputsAfter = screen.getAllByPlaceholderText(/productId/i);
    expect(productInputsAfter.length).toBe(1);
  });
});
