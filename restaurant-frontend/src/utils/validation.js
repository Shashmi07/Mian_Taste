import * as yup from 'yup';

// Common validation schemas
export const emailValidation = yup
  .string()
  .email('Please enter a valid email address')
  .required('Email is required');

export const passwordValidation = yup
  .string()
  .min(8, 'Password must be at least 8 characters')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
  .required('Password is required');

export const phoneValidation = yup
  .string()
  .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
  .required('Phone number is required');

export const nameValidation = yup
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name cannot exceed 50 characters')
  .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
  .required('Name is required');

// Form schemas
export const loginSchema = yup.object({
  email: emailValidation,
  password: yup.string().required('Password is required')
});

export const registerSchema = yup.object({
  username: nameValidation,
  email: emailValidation,
  password: passwordValidation,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password')
});

export const customerRegisterSchema = yup.object({
  name: nameValidation,
  email: emailValidation,
  phone: phoneValidation,
  password: passwordValidation,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password')
});

export const adminLoginSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required')
});

export const menuItemSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .required('Name is required'),
  description: yup
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description cannot exceed 500 characters')
    .required('Description is required'),
  price: yup
    .number()
    .positive('Price must be a positive number')
    .min(1, 'Price must be at least Rs. 1')
    .max(10000, 'Price cannot exceed Rs. 10,000')
    .required('Price is required'),
  category: yup.string().required('Category is required'),
  image: yup.string().required('Image is required')
});

export const tableReservationSchema = yup.object({
  customerName: nameValidation,
  customerEmail: emailValidation,
  customerPhone: phoneValidation,
  reservationDate: yup
    .date()
    .min(new Date(), 'Reservation date cannot be in the past')
    .required('Reservation date is required'),
  timeSlot: yup.string().required('Time slot is required'),
  selectedTables: yup
    .array()
    .min(1, 'Please select at least one table')
    .required('Table selection is required')
});

export const tableSelectionSchema = yup.object({
  reservationDate: yup
    .date()
    .min(new Date(), 'Reservation date cannot be in the past')
    .required('Reservation date is required'),
  timeSlot: yup.string().required('Time slot is required'),
  selectedTables: yup
    .array()
    .min(1, 'Please select at least one table')
    .required('Table selection is required')
});

export const preOrderSchema = yup.object({
  customerName: nameValidation,
  customerEmail: emailValidation,
  customerPhone: phoneValidation,
  scheduledDate: yup
    .date()
    .min(new Date(), 'Scheduled date cannot be in the past')
    .required('Scheduled date is required'),
  scheduledTime: yup.string().required('Scheduled time is required'),
  orderType: yup.string().required('Order type is required')
});

export const feedbackSchema = yup.object({
  ratings: yup.object({
    food: yup
      .number()
      .min(1, 'Please rate the food')
      .max(5, 'Rating cannot exceed 5')
      .required('Food rating is required'),
    service: yup
      .number()
      .min(1, 'Please rate the service')
      .max(5, 'Rating cannot exceed 5')
      .required('Service rating is required'),
    ambiance: yup
      .number()
      .min(1, 'Please rate the ambiance')
      .max(5, 'Rating cannot exceed 5')
      .required('Ambiance rating is required'),
    overall: yup
      .number()
      .min(1, 'Please provide an overall rating')
      .max(5, 'Rating cannot exceed 5')
      .required('Overall rating is required')
  }),
  comment: yup
    .string()
    .min(10, 'Comment must be at least 10 characters')
    .max(1000, 'Comment cannot exceed 1000 characters')
    .required('Comment is required')
});

// Payment Gateway validation schemas
export const paymentCustomerInfoSchema = yup.object({
  name: nameValidation,
  email: emailValidation,
  phone: phoneValidation
});

export const paymentCustomerQRSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .required('Name is required')
});

export const paymentCardInfoSchema = yup.object({
  cardNumber: yup
    .string()
    .matches(/^[0-9]{16}$/, 'Card number must be 16 digits')
    .required('Card number is required'),
  expiryDate: yup
    .string()
    .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Expiry date must be in MM/YY format')
    .test('expiry-date', 'Card has expired', function(value) {
      if (!value) return false;
      const [month, year] = value.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      const cardYear = parseInt(year, 10);
      const cardMonth = parseInt(month, 10);
      
      if (cardYear > currentYear) return true;
      if (cardYear === currentYear && cardMonth >= currentMonth) return true;
      return false;
    })
    .required('Expiry date is required'),
  cvv: yup
    .string()
    .matches(/^[0-9]{3,4}$/, 'CVV must be 3 or 4 digits')
    .required('CVV is required'),
  cardholderName: yup
    .string()
    .min(2, 'Cardholder name must be at least 2 characters')
    .max(100, 'Cardholder name cannot exceed 100 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Cardholder name can only contain letters and spaces')
    .required('Cardholder name is required')
});

// User Management validation schemas
export const addUserSchema = yup.object({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username cannot exceed 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .required('Username is required'),
  email: emailValidation,
  password: passwordValidation,
  fullName: nameValidation,
  role: yup
    .string()
    .oneOf(['admin', 'chef', 'waiter'], 'Please select a valid role')
    .required('Role is required'),
  phoneNumber: yup
    .string()
    .matches(/^(\+\d{1,4}\d{7,14}|\d{10})$/, 'Phone number must be valid (e.g., +1234567890 or 0771234567)')
    .required('Phone number is required'),
  address: yup
    .string()
    .max(200, 'Address cannot exceed 200 characters')
    .optional()
});

export const editUserSchema = yup.object({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username cannot exceed 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .required('Username is required'),
  email: emailValidation,
  fullName: nameValidation,
  role: yup
    .string()
    .oneOf(['admin', 'chef', 'waiter'], 'Please select a valid role')
    .required('Role is required'),
  phoneNumber: yup
    .string()
    .matches(/^(\+\d{1,4}\d{7,14}|\d{10})$/, 'Phone number must be valid (e.g., +1234567890 or 0771234567)')
    .required('Phone number is required'),
  address: yup
    .string()
    .max(200, 'Address cannot exceed 200 characters')
    .optional()
});

// Validation helper functions
export const validateField = (value, schema) => {
  try {
    schema.validateSync(value);
    return null;
  } catch (error) {
    return error.message;
  }
};

export const validateForm = (values, schema) => {
  try {
    schema.validateSync(values, { abortEarly: false });
    return {};
  } catch (error) {
    const errors = {};
    error.inner.forEach((err) => {
      if (err.path) {
        errors[err.path] = err.message;
      }
    });
    return errors;
  }
};