import { CreateOrderUseCase } from "../../../src/application/usecases/createOrder";
import { OrderRepository } from "../../../src/infrastructure/repositories/OrderRepository";
import { Order } from "../../../src/domain/order";

class InMemoryOrderRepositoryStub implements OrderRepository {
  public savedOrders: Order[] = [];

  async save(order: Order): Promise<void> {
    this.savedOrders.push(order);
  }

  async findById(_id: string): Promise<Order | null> {
    return null;
  }

  async findAll(): Promise<Order[]> {
    return this.savedOrders;
  }
}

describe("CreateOrderUseCase", () => {
  it("should create and persist an order", async () => {
    const repo = new InMemoryOrderRepositoryStub();
    const useCase = new CreateOrderUseCase(repo);

    const result = await useCase.execute({
      customerName: "Empresa Y",
      items: [{ id: "1", name: "Buffet", quantity: 10 }]
    });

    expect(result.id).toBeDefined();
    expect(result.customerName).toBe("Empresa Y");
    expect(repo.savedOrders.length).toBe(1);
    expect(repo.savedOrders[0].id).toBe(result.id);
  });
});
