import { Product, Store as ProductDB } from '../../models/product';
const productDB: ProductDB = new ProductDB();

describe("product model", () => {
  const prod: Product = {
    name: "laptop",
    price: 1050,
    category: "electronics",
  }

  it("should create new product", async () => {
    const newProd: Product = await productDB.create(prod);
    expect(newProd.id).toBeTruthy();
  })

  it("should get all products", async () => {
    const allProds: Product[] = await productDB.index();
    expect(allProds).toEqual([{
      id: 1
      , ...prod
    }]);
  })

  it('should get one product', async () => {
    const prod_1: Product = await productDB.show('1');
    expect(prod_1).toEqual({
      id: 1
      , ...prod
    });
  })
  
  it('should remove the product', async () => {
    await productDB.delete("1")
    const products: Product[] = await productDB.index();
    expect(products).toEqual([]);
  })
})