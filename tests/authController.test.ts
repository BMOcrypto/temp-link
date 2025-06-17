import AuthController from '../src/controllers/authController';
import { Request, Response } from 'express';

describe('AuthController', () => {
  it('should be defined', () => {
    expect(AuthController).toBeDefined();
  });
  // Add more tests for register, login, etc.
});
