import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { GenderCategory } from '../utils/enums';
import { mockProduct } from '../utils/constants';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

describe('ProductsController', () => {
  let controller: ProductsController;
  const mockProductsService = {
    getAllProducts: jest.fn(),
    searchText: jest.fn(),
    getProduct: jest.fn(),
    addProduct: jest.fn(),
    updateProduct: jest.fn(),
    removeProduct: jest.fn(),
    getAllCarts: jest.fn(),
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    buyNow: jest.fn(),
    updateQuantity: jest.fn(),
    saveShippingDetails: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    })
      .overrideProvider(ProductsService)
      .useValue(mockProductsService)
      .compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllProducs', () => {
    it('should return all products', async () => {
      const expectedResult = {
        products: {
          mockProduct,
        },
        totalCount: expect.any(Number),
      };
      const page = 1;
      const limit = 1;
      const category = 0;
      const sortOrder = 'asc';

      mockProductsService.getAllProducts.mockResolvedValue(expectedResult);

      const result = await controller.getAllProducts(
        page,
        limit,
        category,
        sortOrder,
      );

      expect(result).toEqual(expectedResult);
      expect(mockProductsService.getAllProducts).toHaveBeenCalledWith(
        page,
        limit,
        category,
        sortOrder,
      );
    });
  });

  describe('searchText', () => {
    const mockRequest = {
      query: { search: 'sample', page: '1', limit: '5' },
    } as any;
    it('should give result as per search', async () => {
      const expectedResult = {
        data: {
          mockProduct,
        },
        totalCount: expect.any(Number),
        page: expect.any(Number),
        last_page: expect.any(Number),
      };

      mockProductsService.searchText.mockReturnValue(expectedResult);

      const result = await controller.searchText(mockRequest);

      expect(result).toEqual(expectedResult);
      expect(mockProductsService.searchText).toHaveBeenCalledWith(mockRequest);
    });

    it('should throw NotFoundException when no results found', async () => {
      // Mock the productsService searchText method to throw NotFoundException
      mockProductsService.searchText.mockRejectedValue(new NotFoundException());

      // Call the searchText method and expect it to throw NotFoundException
      await expect(controller.searchText(mockRequest)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw HttpException when an error occurs', async () => {
      // Mock the productsService searchText method to throw HttpException
      mockProductsService.searchText.mockRejectedValue(
        new HttpException({}, HttpStatus.INTERNAL_SERVER_ERROR),
      );

      // Call the searchText method and expect it to throw HttpException
      await expect(controller.searchText(mockRequest)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getProduct', () => {
    it('should return a product', async () => {
        const expectedResult = {
            product:{
                mockProduct
            }
        };
        const id = 1;
        const userId = 34;

        mockProductsService.getProduct.mockResolvedValue(expectedResult);

        const result = await controller.getProduct(id, userId);

        expect(result).toEqual(expectedResult);
        expect(mockProductsService.getProduct).toHaveBeenCalledWith(id, userId);
    })
  })
});
