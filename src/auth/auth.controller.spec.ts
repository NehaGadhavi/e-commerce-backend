import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { adminData, loginData, mockSuperAdmin, mockUser, registerData } from '../utils/constants';
import { AuthService } from './auth.service';
import { GenderCategory, UserRoles } from '../utils/enums';
import { UsersEntity } from './users.entity';
import { SaveOptions, RemoveOptions } from 'typeorm';
import { RegisterUserDto } from '../dtos/user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {

    loginUser: jest.fn(),

    registerUser: jest.fn(),

    getAllUsers: jest.fn(),

    addAdmin: jest.fn(),

    removeUser: jest.fn(),

    updateAdmin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService]
    })
    .overrideProvider(AuthService)
    .useValue(mockAuthService)
    .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('should login user', () => {
  //   expect(controller.login(loginData)).toEqual({
  //     id: expect.any(Number),
  //     ...loginData,
  //   });
  // });

  // it('should register user', () => {
  //   expect(controller.registration(registerData)).toEqual({
  //     id: expect.any(Number),
  //     ...registerData
  //   })
  // });

  describe('loginUser', () => {
    it('should login user', async () => {
      const expectedResult = {
        tokenResponse: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
          expires: expect.any(Number),
        }
      };

      mockAuthService.loginUser.mockResolvedValue(expectedResult);

      const result = await controller.login(loginData);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.loginUser).toHaveBeenCalledWith(loginData);
    })
  });

  describe('registerUser', () => {
    it('should register user', async () => {
      const expectedResult = {
        savedUser: {
          id: expect.any(Number),
          ...registerData,
        }
      };

      mockAuthService.registerUser.mockResolvedValue(expectedResult);

      const result = await controller.registration(registerData);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.registerUser).toHaveBeenCalledWith(registerData);
    })
  })


  describe('getAllUsers', () => {
    it('should get all users', async () => {

      const mockPage = 1;
      const mockLimit = 10;

      const mockUsersData = [
        // Mocked user data array
        { id: 1, username: 'user1', roles: UserRoles.ViewerAdmin },
        { id: 2, username: 'user2', roles: UserRoles.ViewerAdmin },
      ];

      const expectedResult = {
        data: mockUsersData,
        totalCount: mockUsersData.length,
      };

      // Mock the service method
      mockAuthService.getAllUsers.mockResolvedValue(expectedResult);

      const result = await controller.getAllUsers(mockUser, mockPage, mockLimit);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.getAllUsers).toHaveBeenCalledWith(mockUser, mockPage, mockLimit);
    });

  });

  describe('addAdmin', () => {
    it('should add admin', async () => {
      
      const expectedResult = {
        savedUser: {
          id: expect.any(Number),
          username: adminData.username,
          email: adminData.email,
          gender: adminData.gender,
          dob: adminData.dob,
          address: adminData.address,
        },
      };

      // Mock the service method
      mockAuthService.addAdmin.mockResolvedValue(expectedResult);

      const result = await controller.addAdmin(adminData);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.addAdmin).toHaveBeenCalledWith(adminData);
    });

  });

  describe('removeUser', () => {
    it('should delete user',async () => {
      const expectedResult = {
        success: true
      };

      // Mock the service method
      mockAuthService.removeUser.mockResolvedValue(expectedResult);
      const mockId = Date.now();

      const result = await controller.removeUser(mockId);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.removeUser).toHaveBeenCalledWith(mockId);
    });
  });

  describe('updateAdmin', () => {
    it('should update admin', async () => {
      const mockId = 1;

      const expectedResult = {
        savedAdmin: {
          id: mockId,
          username: adminData.username,
          email: adminData.email,
          gender: adminData.gender,
          dob: adminData.dob,
          address: adminData.address,
          // ... other properties
        },
      };

      // Mock the service method
      mockAuthService.updateAdmin.mockResolvedValue(expectedResult);

      const result = await controller.updateAdmin(adminData, mockId, mockSuperAdmin);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.updateAdmin).toHaveBeenCalledWith(mockId, adminData, mockSuperAdmin);
    });

  });

  
});
