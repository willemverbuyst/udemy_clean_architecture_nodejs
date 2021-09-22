const Chance = require('chance');
const { cloneDeep } = require('lodash');
const { v4: uuidv4 } = require('uuid');
const updateLogUseCase = require('./updateLog.useCase');
const {
  constants: {
    logConstants: { meansOfTransport, statusOfDay },
  },
} = require('../../entities');

const chance = new Chance();

describe('Log use cases', () => {
  const testLogData = {
    date: chance.date(),
    statusOfDay: statusOfDay.WORKING_AT_THE_OFFICE,
    durationTrip: chance.natural(),
    meansOfTransport: meansOfTransport.CAR,
    startingPoint: chance.city(),
    destination: chance.city(),
    meta: { comment: chance.sentence() },
  };

  const mockLogRepo = {
    add: jest.fn(async (log) => ({
      ...log,
      id: uuidv4(),
    })),
    getById: jest.fn(async (id) => ({
      id,
      date: chance.date(),
      statusOfDay: statusOfDay.WORKING_AT_THE_OFFICE,
      durationTrip: chance.natural(),
      meansOfTransport: meansOfTransport.CAR,
      startingPoint: chance.city(),
      destination: chance.city(),
      meta: { comment: chance.sentence() },
    })),
    update: jest.fn(async (log) => log),
    delete: jest.fn(async (log) => log),
  };

  const depencies = {
    logsRepository: mockLogRepo,
  };

  describe('Update log use case', () => {
    test('Log should be updated', async () => {
      // create log
      const mockLog = {
        ...testLogData,
        id: uuidv4(),
      };
      const updatedLog = await updateLogUseCase(depencies).execute({
        log: cloneDeep(mockLog),
      });
      // check the result
      expect(updatedLog).toEqual(mockLog);

      // check the call
      const expectedLog = mockLogRepo.update.mock.calls[0][0];
      expect(expectedLog).toEqual(mockLog);
    });
  });
});
