import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { loginData, registerData } from '../utils/constants';
import { AuthService } from './auth.service';
import { GenderCategory, UserRoles } from '../utils/enums';
import { UsersEntity } from './users.entity';
import { SaveOptions, RemoveOptions } from 'typeorm';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    loginUser: jest.fn((loginData) => {
      return {
        id: Date.now(),
        ...loginData,
      };
    }),

    registerUser: jest.fn((registerData) => {
      return {
        id: Date.now(),
        ...registerData,
      }
    }),

    // getAllUsers: jest.fn(),

    
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

  it('should login user', () => {
    expect(controller.login(loginData)).toEqual({
      id: expect.any(Number),
      ...loginData,
    });
  });

  it('should register user', () => {
    expect(controller.registration(registerData)).toEqual({
      id: expect.any(Number),
      ...registerData
    })
  });

  // describe('getAllUsers', () => {
  //   it('should get all users successfully', async () => {
  //     const mockUser: UsersEntity = {
  //       // Mock user data
  //       id: 1,
  //       roles: UserRoles.ViewerAdmin,
  //       username: '',
  //       email: '',
  //       password: '',
  //       cartProducts: [],
  //       gender: GenderCategory.Men,
  //       dob: '',
  //       address: '',
  //       total_purchase: 0,
  //       total_payment: 0,
  //       validatePassword: function (attempt: string): Promise<boolean> {
  //         throw new Error('Function not implemented.');
  //       },
  //       hasId: function (): boolean {
  //         throw new Error('Function not implemented.');
  //       },
  //       save: function (options?: SaveOptions): Promise<UsersEntity> {
  //         throw new Error('Function not implemented.');
  //       },
  //       remove: function (options?: RemoveOptions): Promise<UsersEntity> {
  //         throw new Error('Function not implemented.');
  //       },
  //       softRemove: function (options?: SaveOptions): Promise<UsersEntity> {
  //         throw new Error('Function not implemented.');
  //       },
  //       recover: function (options?: SaveOptions): Promise<UsersEntity> {
  //         throw new Error('Function not implemented.');
  //       },
  //       reload: function (): Promise<void> {
  //         throw new Error('Function not implemented.');
  //       }
  //     };

  //     const mockPage = 1;
  //     const mockLimit = 10;

  //     const mockUsersData = [
  //       // Mocked user data array
  //       { id: 1, username: 'user1', roles: UserRoles.ViewerAdmin },
  //       { id: 2, username: 'user2', roles: UserRoles.ViewerAdmin },
  //     ];

  //     const expectedResult = {
  //       data: mockUsersData,
  //       totalCount: mockUsersData.length,
  //     };

  //     // Mock the service method
  //     mockAuthService.getAllUsers.mockResolvedValue(expectedResult);

  //     const result = await controller.getAllUsers(mockUser, mockPage, mockLimit);

  //     expect(result).toEqual(expectedResult);
  //     expect(mockAuthService.getAllUsers).toHaveBeenCalledWith(mockUser, mockPage, mockLimit);
  //   });

  //   // Add more test cases for getAllUsers if needed
  // });
  
});
