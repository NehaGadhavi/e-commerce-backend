import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersEntity } from './users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { GenderCategory } from '../utils/enums';
import { mockUser } from '../utils/constants';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserRepository: Partial<Record<'findOne', jest.Mock>>;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: mockUserRepository,
        },
      ],
      imports: [
        JwtModule.register({
          secret: process.env.SECRET,
          signOptions: { expiresIn: '1h' },
        }),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return the logged user profile', async () => {

      // Expected customer profile data
      const expectedCustomerProfile = {
        address: 'Amdavad',
        cartProducts: [],
        dob: '',
        email: 'tester@gmail.com',
        gender: GenderCategory.Men,
        id: 1,
        total_payment: 0,
        total_purchase: 0,
        username: 'tester',
      };

      // Mock the user repository to return the user
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // Call the getUserById method
      const result = await service.getUserById(mockUser);

      // Assert the result
      expect(result.data).toEqual({customer:{expectedCustomerProfile}});
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
    });
  });
});
