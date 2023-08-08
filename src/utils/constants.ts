import { UserRoles } from "./enums";

export const GOOGLE_CLIENT_ID =
  '252306307767-p74ur0m74vtd0vb8035bd7raimph6jhs.apps.googleusercontent.com';
export const GOOGLE_SECRET = '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';

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
  empty_email: 'Email should no be empty',
  password:
    'Password must contain 8-10 characters, Password must include numbers',
  invalid_email: 'Invalid email entered!',

  empty_productName: 'Product Name should not be empty!',
  empty_price: 'Price should not be empty',
  empty_quantity: 'Quantity should not be empty',
  empty_category: 'Category shoul not be empty',
};

export const passwordValidation = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$/;

export const SUCCESS_MSG = {
  user_register_success: 'User registered successfully.',
  user_login_success: 'User logged in successfully.',
  admin_register_success: 'Admin added successfully.',
  user_delete_succes: 'User removed successfully.',
  admin_update_success: 'Admin details updated successfully.',
  product_add_success: 'Product added successfully.',
  product_update_success: 'Product added successfully.',
  product_delete_success: 'Product removed successfully.',
  add_to_cart_success: 'Product added to cart successfully.',
  cart_delete_success: 'Product removed from cart successfully.',
  product_purchase_success: 'Product purchased successfully.',
  cart_update_success: 'Products in cart updated successfully.',
}

export const ERROR_MSG = {
  username_already_taken: 'Username already taken.',
  user_not_found: 'No user found',
  invalid_credential: 'Invalid credentials.',
  unauthorized_delete: 'Super Admin cannot be deleted!',
  admin_not_found: 'Admin not found!',
  product_not_found: 'Product not found!',
  not_enogh_products: 'Oops, Not enough Products!',
}

export const DATABASE_ERROR_MSG = {
  user_delete: 'User not removed!',
  product_update: 'Product not updated!',
  product_delete: 'Product not removed!',
  add_to_cart: 'Product not added to cart!',
  cart_delete: 'Product not removed from cart!',
  product_purchase: 'Product not purchased yet!',
  cart_update: 'Cart products not updated!',
}
