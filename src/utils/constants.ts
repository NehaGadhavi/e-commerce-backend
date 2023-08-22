import { UsersEntity } from '../auth/users.entity';
import { SaveOptions, RemoveOptions } from 'typeorm';
import { GenderCategory, UserRoles } from './enums';

export const GOOGLE_CLIENT_ID =
  '252306307767-p74ur0m74vtd0vb8035bd7raimph6jhs.apps.googleusercontent.com';
export const GOOGLE_SECRET = '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';
export const GOOGLE_CALLBACK_URL = 'http://localhost:8000/auth/google/callback';

export interface JwtExePayload {
  created_by: string;
  id: number;
}

export interface JwtPayload {
  email: string;
  userId: number;
  roles: UserRoles;
}

export const expired = 14400;

export const ResponseMap = <T>(
  data: T,
  message?: string | '',
): { data: T; message: string } => {
  return {
    data,
    message: message || '',
  };
};

export const DtoErrorMessage = {
  username: 'Username should not be greater than 50 character.',
  empty_username: 'Username should not be empty!',
  empty_password: 'Password should not be empty!',
  empty_description: 'Description should not be empty!',
  empty_image: 'Image field should not be empty!',
  empty_email: 'Email should no be empty',
  empty_dob: 'Date of Birth should nt be empty',
  empty_gender: 'Gender should not be empty',
  empty_address: 'Address should not be empty',
  password:
    'Password must contain 8-10 characters, Password must include numbers',
  invalid_email: 'Invalid email entered!',

  empty_productName: 'Product Name should not be empty!',
  empty_price: 'Price should not be empty',
  empty_quantity: 'Quantity should not be empty',
  empty_category: 'Category shoul not be empty',
  empty_name: 'Name should not be empty',
  // empty_lastName: 'Last Name should not be empty',
  // empty_address: 'Address should not be empty',
  // empty_addressLine2: 'Address line2 should not be empty',
  empty_city: 'City name should not be empty',
  // empty_zipPostal: 'Zip/Postal should not be empty',
  empty_country: 'Country name should not be empty',
  empty_pinCode: 'Pin code should not be empty',
};

export const passwordValidation =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;

export const SUCCESS_MSG = {
  user_register_success: 'User registered successfully.',
  user_login_success: 'You have logged in successfully.',
  admin_register_success: 'Admin added successfully.',
  user_delete_succes: 'User removed successfully.',
  admin_update_success: 'Admin details updated successfully.',
  product_add_success: 'Product added successfully.',
  product_update_success: 'Product updated successfully.',
  product_delete_success: 'Product removed successfully.',
  add_to_cart_success: 'Product added to cart successfully.',
  cart_delete_success: 'Product removed from cart successfully.',
  product_purchase_success: 'Product purchased successfully.',
  cart_update_success: 'Cart product updated successfully.',
  details_saved_success: 'Details saved successfully.',
  profile_update_success: 'Profile updated successfully',
};

export const ERROR_MSG = {
  already_registered: 'Already registered user!',
  user_not_found: 'No user found',
  invalid_credential: 'Invalid credentials.',
  unauthorized_delete: 'Super Admin cannot be deleted!',
  admin_not_found: 'Admin not found!',
  product_not_found: 'Product not found!',
  not_enough_products: 'Oops, Not enough Products!',
  not_in_cart: 'Product not found in the cart.',
  already_bought: 'Product is already purchased.',
  unauthorized_to_buy: 'Sorry you cannot buy someone else cart product!',
  not_found: 'Oops, No results found for your search!',
  no_products_to_buy: 'Oops, There are no products in cart!',
  cant_be_added: 'Product with 0 quantity cannot be added to cart!',
  unauthorized_error: 'Sorry, you are not authorized!',
  invalid_age: 'Sorry, you cant register before 18!',
};

export const DATABASE_ERROR_MSG = {
  user_delete: 'User not removed!',
  product_update: 'Product not updated!',
  product_delete: 'Product not removed!',
  add_to_cart: 'Product not added to cart!',
  cart_delete: 'Product not removed from cart!',
  product_purchase: 'Oops, Product not purchase!',
  cart_update: 'Cart products not updated!',
  product_save: 'Product not saved!',
  shippingDetails_save: 'Shipping details not saved!',
  product_in_cart: 'This product is already added by someone in cart!',
  profile_not_updated: 'Profile not updated!',
};

export const loginData = {
  email: 'yash@gmail.com',
  password: 'Yash@123',
  roles: UserRoles.Customer,
}

export const registerData = {
  username: 'testcase',
  password: 'Testcase@123',
  email: 'testcase@gmail.com',
  roles: UserRoles.Customer,
  dob: '2023-08-31T07:24:45.391Z',
  gender: GenderCategory.Men,
  address: 'testing address',
  total_purchase: 0,
  total_payment: 0,
}

export const mockUser: UsersEntity = {
  // Mock user data
  id: 1,
  roles: UserRoles.ViewerAdmin,
  username: 'tester',
  email: 'tester@gmail.com',
  password: 'Tester@123',
  cartProducts: [],
  gender: GenderCategory.Men,
  dob: '',
  address: 'Amdavad',
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
  }
};

export const mockSuperAdmin: UsersEntity = {
  // Mock super admin data
  id: 1,
  roles: UserRoles.SuperAdmin,
  username: '',
  email: '',
  password: '',
  cartProducts: [],
  gender: GenderCategory.Men,
  dob: '',
  address: '',
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
  }
}

export const adminData = {
  username: 'testAdmin',
  password: 'testAdmin@123',
  email: 'testadmin@gmail.com',
  roles: UserRoles.ViewerAdmin,
  dob: '2023-08-31T07:24:45.391Z',
  gender: GenderCategory.Men,
  address: 'testing address',
  total_purchase: 0,
  total_payment: 0,
}