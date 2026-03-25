
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock de las funciones del servicio API
jest.mock('./services/api', () => ({
  fetchOrders: jest.fn(),
  createOrder: jest.fn(),
  updateOrderStatus: jest.fn(),
  cancelOrder: jest.fn(),
}));

import {
  fetchOrders,
  createOrder,
  updateOrderStatus,
  cancelOrder,
} from './services/api';
import type { Order } from './types/Order';

const mockOrders: Order[] = [
  {
    id: '1',
    customerName: 'Cliente 1',
    status: 'CREATED',
    createdAt: new Date().toISOString(),
    updatedAt: undefined,
    items: [
      { productId: 'P1', quantity: 2 },
    ],
  },
];

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('carga y muestra pedidos al inicializar', async () => {
    (fetchOrders as jest.Mock).mockResolvedValueOnce(mockOrders);

    render(<App />);

    // Verificamos que se muestra el título principal
    expect(
      screen.getByText(/GreenBite Catering - Gestión de Pedidos/i),
    ).toBeInTheDocument();

    // Muestra indicador de carga inicialmente
    expect(screen.getByText(/Cargando pedidos.../i)).toBeInTheDocument();

    // Espera a que se muestren los pedidos
    expect(await screen.findByText(/Cliente 1/)).toBeInTheDocument();
    expect(fetchOrders).toHaveBeenCalledTimes(1);
  });

  test('maneja error al cargar pedidos', async () => {
    (fetchOrders as jest.Mock).mockRejectedValueOnce(
      new Error('Error al obtener pedidos'),
    );

    render(<App />);

    expect(
      await screen.findByText(/Error al obtener pedidos/i),
    ).toBeInTheDocument();
  });

  test('crea un pedido mediante el formulario y recarga la lista', async () => {
    (fetchOrders as jest.Mock).mockResolvedValueOnce([]).mockResolvedValueOnce(
      mockOrders,
    );
    (createOrder as jest.Mock).mockResolvedValueOnce({
      ...mockOrders[0],
      id: '2',
    });

    render(<App />);

    // Espera a que termine la primera carga (sin pedidos)
    await waitFor(() =>
      expect(fetchOrders).toHaveBeenCalledTimes(1),
    );

    const user = userEvent.setup();

    const nameInput = screen.getByLabelText(/Nombre cliente:/i);
    await user.type(nameInput, 'Nuevo Cliente');

    const productInput = screen.getByPlaceholderText(/productId/i);
    await user.type(productInput, 'P2');

    const qtyInput = screen.getByDisplayValue('1');
    await user.clear(qtyInput);
    await user.type(qtyInput, '3');

    const submitButton = screen.getByRole('button', {
      name: /Crear pedido/i,
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(createOrder).toHaveBeenCalledTimes(1);
      expect(fetchOrders).toHaveBeenCalledTimes(2); // carga inicial + recarga
    });
  });

  test('cambia el estado de un pedido', async () => {
    (fetchOrders as jest.Mock).mockResolvedValue(mockOrders);
    (updateOrderStatus as jest.Mock).mockResolvedValue({
      ...mockOrders[0],
      status: 'CONFIRMED',
    });

    render(<App />);

    // Esperar a que se cargue el pedido
    await screen.findByText(/Cliente 1/);

    const user = userEvent.setup();

    const select = screen.getByDisplayValue('CREATED') as HTMLSelectElement;
    await user.selectOptions(select, 'CONFIRMED');

    await waitFor(() => {
      expect(updateOrderStatus).toHaveBeenCalledTimes(1);
    });
  });

  test('cancela un pedido cuando el usuario confirma', async () => {
    (fetchOrders as jest.Mock).mockResolvedValue(mockOrders);
    (cancelOrder as jest.Mock).mockResolvedValue(undefined);

    // Mock de window.confirm
    const confirmSpy = jest
      .spyOn(window, 'confirm')
      .mockImplementation(() => true);

    render(<App />);

    await screen.findByText(/Cliente 1/);

    const user = userEvent.setup();
    const cancelButton = screen.getByRole('button', {
      name: /Cancelar pedido/i,
    });

    await user.click(cancelButton);

    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled();
      expect(cancelOrder).toHaveBeenCalledWith('1');
    });

    confirmSpy.mockRestore();
  });

  test('no cancela un pedido cuando el usuario rechaza la confirmación', async () => {
    (fetchOrders as jest.Mock).mockResolvedValue(mockOrders);
    const cancelSpy = (cancelOrder as jest.Mock).mockResolvedValue(undefined);

    const confirmSpy = jest
      .spyOn(window, 'confirm')
      .mockImplementation(() => false);

    render(<App />);

    await screen.findByText(/Cliente 1/);

    const user = userEvent.setup();
    const cancelButton = screen.getByRole('button', {
      name: /Cancelar pedido/i,
    });

    await user.click(cancelButton);

    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled();
      expect(cancelSpy).not.toHaveBeenCalled();
    });

    confirmSpy.mockRestore();
  });
});
