import { Order, Status, Store as OrderDB } from '../../models/order';
import { User, Store as UserDB } from '../../models/user';

const orderDB: OrderDB = new OrderDB();

describe("order model", () => {
  const user: User = {
    firstname: "John",
    lastname: "Wick",
    password: "some string",
  }

  const order: Order = {
    user_id: "2",
    status: Status.active,
  }

  beforeAll(async () => {
    await (new UserDB()).create(user);
  })

  afterAll(async () => {
    await (new UserDB()).delete("2");
  })

  it("should create new order", async () => {
    const newOrder: Order = await orderDB.create(order);
    expect(newOrder.id).toBeTruthy();
  })

  it("should get all orders", async () => {
    const orders: Order[] = await orderDB.index();
    expect(orders).toEqual([{
      id: 1
      , ...order
    }]);
  })

  it('should get one order', async () => {
    const order_1: Order = await orderDB.show('1');
    expect(order_1).toEqual({
      id: 1
      , ...order
    });
  })
  
  it('should remove the order', async () => {
    await orderDB.delete("1")
    const orders: Order[] = await orderDB.index();
    expect(orders).toEqual([]);
  })
})