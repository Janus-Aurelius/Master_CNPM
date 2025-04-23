import { AdminController } from '../controllers/AdminController';
import { Request, Response } from 'express';
import { UserManager } from '../business/admin/user.manager';

jest.mock('../business/admin/user.manager');

describe('AdminController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    req = { body: { name: 'test user' } };
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;
    res = { status: statusMock };
  });

  it('should create user successfully', async () => {
    const mockCreate = jest.fn().mockResolvedValue({ success: true });
    (UserManager as jest.Mock).mockImplementation(() => ({
      createUser: mockCreate,
    }));

    const controller = new AdminController();
    await controller.createUser(req as Request, res as Response);

    expect(mockCreate).toHaveBeenCalledWith(req.body);
    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({ success: true });
  });
});
