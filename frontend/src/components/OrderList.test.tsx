import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OrderList } from './OrderList';
import type { Order } from '../types/Order';

const baseOrder: Order = {
  id: '1',
  customerName: 'Cliente 1',
  status: 'CREATED',
  createdAt: new Date().toISOString(),
  updatedAt: undefined, // ⟵ ahora coincide con string | undefined
  items: [
    { productId: 'P1', quantity: 1 },
  ],
};


describe('OrderList', () => {
  test('muestra mensaje de carga cuando loading es true', () => {
    render(
      <OrderList
        orders={[]}
        loading={true}
        error={null}
        onChangeStatus={jest.fn()}
        onCancel={jest.fn()}
        onRefresh={jest.fn()}
      />,
    );

    expect(
      screen.getByText(/Cargando pedidos.../i),
    ).toBeInTheDocument();
  });

  test('muestra mensaje de error cuando hay error', () => {
    render(
      <OrderList
        orders={[]}
        loading={false}
        error="Error de test"
        onChangeStatus={jest.fn()}
        onCancel={jest.fn()}
        onRefresh={jest.fn()}
      />,
    );

    expect(screen.getByText(/Error de test/i)).toBeInTheDocument();
  });

  test('muestra mensaje de lista vacía cuando no hay pedidos', () => {
    render(
      <OrderList
        orders={[]}
        loading={false}
        error={null}
        onChangeStatus={jest.fn()}
        onCancel={jest.fn()}
        onRefresh={jest.fn()}
      />,
    );

    expect(screen.getByText(/No hay pedidos/i)).toBeInTheDocument();
  });

  test('muestra pedidos y permite cambiar el estado', async () => {
    const onChangeStatus = jest.fn();
    const onCancel = jest.fn();
    const onRefresh = jest.fn();

    render(
      <OrderList
        orders={[baseOrder]}
        loading={false}
        error={null}
        onChangeStatus={onChangeStatus}
        onCancel={onCancel}
        onRefresh={onRefresh}
      />,
    );

    expect(screen.getByText(/Cliente 1/)).toBeInTheDocument();

    const user = userEvent.setup();

    // Botón de refrescar
    const refreshButton = screen.getByRole('button', {
      name: /Refrescar/i,
    });
    await userEvent.click(refreshButton);
    expect(onRefresh).toHaveBeenCalledTimes(1);

    // Cambio de estado
    const select = screen.getByDisplayValue('CREATED') as HTMLSelectElement;
    await user.selectOptions(select, 'CONFIRMED');

    expect(onChangeStatus).toHaveBeenCalledWith('1', 'CONFIRMED');

    // Botón de cancelar pedido
    const cancelButton = screen.getByRole('button', {
      name: /Cancelar pedido/i,
    });

    await user.click(cancelButton);
    expect(onCancel).toHaveBeenCalledWith('1');
  });
});
