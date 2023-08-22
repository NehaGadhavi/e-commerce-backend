import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersEntity } from './users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { adminData, mockSuperAdmin } from '../utils/constants';
import { GenderCategory, UserRoles } from '../utils/enums';
import { SaveOptions, RemoveOptions } from 'typeorm';
import { JwtModule } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserRepository: Partial<Record<'findOne' | 'update', jest.Mock>>;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UsersEntity), // Adjust the import path if needed
          useValue: mockUserRepository,
        },
      ],
      imports: [
        JwtModule.register({
          secret: 'yourSecretKey', // Provide the secret key as you did in AuthModule
          signOptions: { expiresIn: '1h' },
        }),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateAdmin', () => {
    it('should update admin successfully', async () => {
      const mockId = 1;
      // const mockAdminDto: UpdateAdminDto = {
      //   // Mock admin DTO data
      //   username: 'newUsername',
      //   email: 'newEmail@example.com',
      //   gender: 'female',
      //   dob: new Date('1995-01-01'),
      //   address: 'New Admin Address',
      //   password: 'newPassword',
      // };

      const mockAdmin: UsersEntity = {
        // Mock admin data
        id: mockId,
        username: 'oldUsername',
        email: 'oldEmail@example.com',
        gender: GenderCategory.Men,
        dob: '2023-08-31T07:24:45.391Z',
        address: 'Old Admin Address',
        password: '',
        roles: UserRoles.SuperAdmin,
        cartProducts: [],
        total_purchase: 0,
        total_payment: 0,
        validatePassword: function (attempt: string): Promise<boolean> {
          throw new Error('Function not implemented.');
        },
        hasId: function (): boolean {
          throw new Error('Function not implemented.');
        },
        save: function (options?: SaveOptions): Promise<UsersEntity> {
          throw new Error('Function not implemented.');
        },
        remove: function (options?: RemoveOptions): Promise<UsersEntity> {
          throw new Error('Function not implemented.');
        },
        softRemove: function (options?: SaveOptions): Promise<UsersEntity> {
          throw new Error('Function not implemented.');
        },
        recover: function (options?: SaveOptions): Promise<UsersEntity> {
          throw new Error('Function not implemented.');
        },
        reload: function (): Promise<void> {
          throw new Error('Function not implemented.');
        },
      };

      // const mockUser: UsersEntity = {
      //   // Mock user data
      //   id: 1,
      //   roles: UserRoles.SuperAdmin,
      //   // ... other properties
      // };

      // Mock the repository method to return the admin
      mockUserRepository.findOne.mockResolvedValue(mockAdmin);

      // Mock the repository update method
      mockUserRepository.update.mockResolvedValue({ affected: 1 }); // Or adjust based on your implementation

      const result = await service.updateAdmin(
        mockId,
        adminData,
        mockSuperAdmin,
      );

      expect(result).toEqual({
        data: {
          savedAdmin: {
            id: mockId,
            username: adminData.username,
            email: adminData.email,
            gender: adminData.gender,
            dob: adminData.dob,
            address: adminData.address,
            affected: 1,
            // ... other properties
          },
        },
        message: 'Admin details updated successfully.',
      });

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockId },
      });
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockId, {
        username: adminData.username,
        email: adminData.email,
        gender: adminData.gender,
        dob: adminData.dob,
        address: adminData.address,
        password: mockAdmin.password, // If you intend to keep the password
        // ... other properties
      });
    });

    // Add more test cases for updateAdmin if needed
  });
});
