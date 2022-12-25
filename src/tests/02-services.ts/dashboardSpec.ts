import { Order, Status, Store as OrderDB } from '../../models/order';
import { Product, Store as ProductDB } from '../../models/product';
import { User, Store as UserDB } from '../../models/user';
import { DashboardQueries } from '../../services/dashboard';
const dashboardQueries: DashboardQueries = new DashboardQueries();

describe("dashboard functionality", () => {
  describe("order dashboard", () => {
    const user: User = {
      firstname: "John",
      lastname: "Wick",
      password: "some string",
    }
    let user_data: User;
    
    beforeAll(async () => {
      user_data = await (new UserDB()).create(user);
    })
    afterAll(async () => {
      await (new UserDB()).delete(String(user_data.id))
    })

    it("should get current order", async () => {
      const active_order: Order = await (new OrderDB).create({
        user_id: String(user_data.id),
        status: Status.active,
      })
      const current_order: Order = await dashboardQueries.currentOrderByUser(String(user_data.id));
      expect(current_order).toEqual(active_order);
      await (new OrderDB).delete(String(active_order.id))
    })
    it("should get all completed orders", async () => {
      const complete_order = await (new OrderDB).create({
        user_id: String(user_data.id),
        status: Status.complete,
      })
      const completed_orders: Order[] = await dashboardQueries.compOrdersByUser(String(user_data.id));
      expect(completed_orders).toEqual([complete_order]);
      await (new OrderDB).delete(String(complete_order.id))
    })
  })

  describe("product dashboard", () => {

    const product: Product = {
      name: "laptop",
      price: 1050,
      category: "electronics",
    }
    let product_data: Product;

    beforeAll(async () => {
      product_data = await (new ProductDB).create(product);
      expect(product_data.id).not.toBe(undefined);
    })

    afterAll(async () => {
      await (new ProductDB).delete(String(product_data.id));
      const products: Product[] = await (new ProductDB).index();
      expect(products).toEqual([]);
    })

    it("should top 5 popular products", async () => {
      const allProds: Product[] = await dashboardQueries.mostPopularProducts();
      expect(allProds).toEqual([]);
    })

    it('should get product of specific category', async () => {
      const products: Product[] = await dashboardQueries.productsByCategory('electronics');
      expect(products).toEqual([product_data]);
    })
  })
})