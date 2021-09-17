const Chance = require('chance');
const { v4: uuidv4 } = require('uuid');
const {
  product: {
    addProductUseCase,
    deleteProductUseCase,
    getProductByIdUseCase,
    updateProductUseCase,
  },
} = require('../../../src/useCases');

const chance = new Chance();

describe('Product use cases', () => {
  const mockProductRepo = {
    add: jest.fn(async (product) => ({
      ...product,
      id: uuidv4(),
    })),
    getById: jest.fn(async (id) => ({
      id,
      name: chance.name(),
      description: chance.sentence(),
      images: [chance.url(), chance.url()],
      price: chance.natural(),
      color: chance.color(),
      meta: { comment: 'test' },
    })),
    update: jest.fn(async (product) => product),
    delete: jest.fn(async (product) => product),
  };

  const depencies = {
    productsRepository: mockProductRepo,
  };

  describe('Add product use case', () => {
    test('Product shoud be added', async () => {
      // create product data
      const testProductData = {
        name: chance.name(),
        description: chance.sentence(),
        images: [chance.url(), chance.url()],
        price: chance.natural(),
        color: chance.color(),
        meta: { comment: 'test' },
      };
      // add a product using the use case
      const addedProduct = await addProductUseCase(depencies).execute(
        testProductData
      );
      // check the received data
      expect(addedProduct).toBeDefined();
      expect(addedProduct.id).toBeDefined();
      expect(addedProduct.name).toBe(testProductData.name);
      expect(addedProduct.description).toBe(testProductData.description);
      expect(addedProduct.images).toEqual(testProductData.images);
      expect(addedProduct.price).toBe(testProductData.price);
      expect(addedProduct.color).toBe(testProductData.color);
      expect(addedProduct.meta).toEqual(testProductData.meta);
      // check that the depencies are called as expected
      const call = mockProductRepo.add.mock.calls[0][0];
      expect(call.id).toBeUndefined();
      expect(call.name).toBe(testProductData.name);
      expect(call.lastName).toBe(testProductData.lastName);
      expect(call.gender).toBe(testProductData.gender);
      expect(call.meta).toEqual(testProductData.meta);
    });
  });

  describe('GetById product use case', () => {
    test('Product should be returned by id', async () => {
      // generate fake id
      const fakeId = uuidv4();
      // call get product by id
      const productById = await getProductByIdUseCase(depencies).execute({
        id: fakeId,
      });
      // check the data
      expect(productById).toBeDefined();
      expect(productById.id).toBe(fakeId);
      expect(productById.name).toBeDefined();
      expect(productById.description).toBeDefined();
      expect(productById.images).toBeDefined();
      expect(productById.price).toBeDefined();
      expect(productById.color).toBeDefined();
      expect(productById.meta).toBeDefined();
      // check the call
      const expectedId = mockProductRepo.getById.mock.calls[0][0];
      expect(expectedId).toBe(fakeId);
    });
  });

  describe('Update product use case', () => {
    test('Product should be updated', async () => {
      // create product
      const testData = {
        id: uuidv4(),
        name: chance.name(),
        description: chance.sentence(),
        images: [chance.url(), chance.url()],
        price: chance.natural(),
        color: chance.color(),
        meta: {},
      };
      const updatedProduct = await updateProductUseCase(depencies).execute({
        product: testData,
      });
      // check the result
      expect(updatedProduct).toEqual(testData);

      // check the call
      const expectedProduct = mockProductRepo.update.mock.calls[0][0];
      expect(expectedProduct).toEqual(testData);
    });
  });

  describe('Delete product use case', () => {
    test('Product should be deleted', async () => {
      // create product
      const testData = {
        id: uuidv4(),
        name: chance.name(),
        description: chance.sentence(),
        images: [chance.url(), chance.url()],
        price: chance.natural(),
        color: chance.color(),
        meta: {},
      };
      const deletedProduct = await deleteProductUseCase(depencies).execute({
        product: testData,
      });
      // check the result
      expect(deletedProduct).toEqual(testData);

      // check the call
      const expectedProduct = mockProductRepo.delete.mock.calls[0][0];
      expect(expectedProduct).toEqual(testData);
    });
  });
});
