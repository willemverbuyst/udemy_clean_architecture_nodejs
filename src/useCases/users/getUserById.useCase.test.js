const Chance = require('chance');
const { v4: uuidv4 } = require('uuid');
const getUserByIdUseCase = require('./getUserById.useCase');
const {
  constants: {
    userConstants: { genders },
  },
} = require('../../entities');

const chance = new Chance();

describe('User use cases', () => {
  const mockUserRepo = {
    add: jest.fn(async (user) => ({
      ...user,
      id: uuidv4(),
    })),
    getById: jest.fn(async (id) => ({
      id,
      name: chance.name(),
      lastName: chance.last(),
      gender: genders.MALE,
      meta: {},
    })),
    update: jest.fn(async (user) => user),
    delete: jest.fn(async (user) => user),
  };

  const depencies = {
    usersRepository: mockUserRepo,
  };

  describe('GetById user use case', () => {
    test('User should be returned by id', async () => {
      // generate fake id
      const fakeId = uuidv4();
      // call get user by id
      const userById = await getUserByIdUseCase(depencies).execute({
        id: fakeId,
      });
      // check the data
      expect(userById).toBeDefined();
      expect(userById.id).toBe(fakeId);
      expect(userById.name).toBeDefined();
      expect(userById.lastName).toBeDefined();
      expect(userById.gender).toBeDefined();
      expect(userById.meta).toBeDefined();
      // check the call
      const expectedId = mockUserRepo.getById.mock.calls[0][0];
      expect(expectedId).toBe(fakeId);
    });
  });
});
