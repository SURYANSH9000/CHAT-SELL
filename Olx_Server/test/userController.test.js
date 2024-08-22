const { expect } = require('chai');
const sinon = require('sinon');
const userService = require('../services/userService');
const userController = require('../controllers/userController');

describe('UserController', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      send: sinon.stub(),
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('registerUser', () => {
    it('should register a user and return 201', async () => {
      const mockUser = { id: 1, token: 'abc123' };
      sinon.stub(userService, 'registerUser').resolves(mockUser);

      req.body = { email: 'test@example.com', password: 'password' };

      await userController.registerUser(req, res, next);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(mockUser)).to.be.true;
    });

    it('should handle errors during registration', async () => {
      sinon.stub(userService, 'registerUser').rejects(new Error('Failed to register user'));

      req.body = { email: 'test@example.com', password: 'password' };

      await userController.registerUser(req, res, next);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith('Internal server error')).to.be.true;
    });
  });

  describe('loginUser', () => {
    it('should log in a user and return 200', async () => {
      const mockLoginResult = { token: 'abc123', userId: 1 };
      sinon.stub(userService, 'loginUser').resolves(mockLoginResult);

      req.body = { email: 'test@example.com', password: 'password' };

      await userController.loginUser(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockLoginResult)).to.be.true;
    });

    it('should handle errors during login', async () => {
      sinon.stub(userService, 'loginUser').rejects(new Error('Unauthorized'));

      req.body = { email: 'test@example.com', password: 'wrongpassword' };

      await userController.loginUser(req, res, next);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.send.calledWith('Unauthorized')).to.be.true;
    });
  });

  // Similarly, you can write tests for getUserById, updateUser, deleteUser
});
