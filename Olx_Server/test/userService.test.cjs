const { expect } = require('chai');
const sinon = require('sinon');
const userService = require('../services/userService');
const mongodbConnection = require('../utils/helperFunctions/mongodbConnection');
const { encrypt, decrypt } = require('../utils/helperFunctions/encrypt_decrypt');

describe('UserService', () => {
  let usersCollectionStub;

  beforeEach(() => {
    usersCollectionStub = {
      find: sinon.stub(),
      insertOne: sinon.stub(),
      findOne: sinon.stub(),
      updateOne: sinon.stub(),
      deleteOne: sinon.stub(),
      sort: sinon.stub().returnsThis(),
      limit: sinon.stub().returnsThis(),
      toArray: sinon.stub(),
    };

    sinon.stub(mongodbConnection, 'mongodbConnection').resolves(usersCollectionStub);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      const mockUser = { email: 'test@example.com', password: 'password' };
      const mockInsertResult = { insertedId: 1 };
      usersCollectionStub.insertOne.resolves(mockInsertResult);
      usersCollectionStub.find.resolves([]);

      const result = await userService.registerUser(mockUser);

      expect(result).to.have.property('id', 1);
      expect(result).to.have.property('token');
      expect(usersCollectionStub.insertOne.calledOnce).to.be.true;
    });

    it('should throw an error if registration fails', async () => {
      const mockUser = { email: 'test@example.com', password: 'password' };
      usersCollectionStub.insertOne.rejects(new Error('Insert failed'));

      try {
        await userService.registerUser(mockUser);
      } catch (error) {
        expect(error.message).to.equal('Failed to register user');
      }
    });
  });

  describe('loginUser', () => {
    it('should log in a user with valid credentials', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: encrypt('password'),
      };
      usersCollectionStub.findOne.resolves(mockUser);

      const result = await userService.loginUser('test@example.com', 'password');

      expect(result).to.have.property('token');
      expect(usersCollectionStub.findOne.calledOnce).to.be.true;
    });

    it('should throw an error if credentials are invalid', async () => {
      usersCollectionStub.findOne.resolves(null);

      try {
        await userService.loginUser('wrong@example.com', 'password');
      } catch (error) {
        expect(error.message).to.equal('Invalid email or password');
      }
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const mockUser = { _id: 1, email: 'test@example.com' };
      usersCollectionStub.findOne.resolves(mockUser);

      const result = await userService.getUserById(1);

      expect(result).to.deep.equal(mockUser);
      expect(usersCollectionStub.findOne.calledOnce).to.be.true;
    });

    it('should return null if no user is found', async () => {
      usersCollectionStub.findOne.resolves(null);

      const result = await userService.getUserById(1);

      expect(result).to.be.null;
    });
  });

  describe('updateUser', () => {
    it('should update a user by ID', async () => {
      const mockUser = { email: 'new@example.com' };
      const mockUpdateResult = { matchedCount: 1, modifiedCount: 1 };
      usersCollectionStub.updateOne.resolves(mockUpdateResult);

      const result = await userService.updateUser(1, mockUser);

      expect(result).to.be.true;
      expect(usersCollectionStub.updateOne.calledOnce).to.be.true;
    });

    it('should return false if no user is updated', async () => {
      const mockUser = { email: 'new@example.com' };
      const mockUpdateResult = { matchedCount: 0, modifiedCount: 0 };
      usersCollectionStub.updateOne.resolves(mockUpdateResult);

      const result = await userService.updateUser(1, mockUser);

      expect(result).to.be.false;
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      const mockDeleteResult = { deletedCount: 1 };
      usersCollectionStub.deleteOne.resolves(mockDeleteResult);

      const result = await userService.deleteUser(1);

      expect(result).to.be.true;
      expect(usersCollectionStub.deleteOne.calledOnce).to.be.true;
    });

    it('should return false if no user is deleted', async () => {
      const mockDeleteResult = { deletedCount: 0 };
      usersCollectionStub.deleteOne.resolves(mockDeleteResult);

      const result = await userService.deleteUser(1);

      expect(result).to.be.false;
    });
  });
});
