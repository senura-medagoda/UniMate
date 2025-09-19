import { Toaster, toast } from 'react-hot-toast';


export const toastConfig = {
  
  success: {
    duration: 4000,
    style: {
      background: '#10B981',
      color: '#FFFFFF',
      border: '1px solid #059669',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#FFFFFF',
      secondary: '#10B981',
    },
  },
  
 
  error: {
    duration: 5000,
    style: {
      background: '#EF4444',
      color: '#FFFFFF',
      border: '1px solid #DC2626',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#FFFFFF',
      secondary: '#EF4444',
    },
  },
  

  info: {
    duration: 4000,
    style: {
      background: '#3B82F6',
      color: '#FFFFFF',
      border: '1px solid #2563EB',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#FFFFFF',
      secondary: '#3B82F6',
    },
  },
  

  warning: {
    duration: 4000,
    style: {
      background: '#F59E0B',
      color: '#FFFFFF',
      border: '1px solid #D97706',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#FFFFFF',
      secondary: '#F59E0B',
    },
  },
};


export const FoodDeliveryToaster = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={toastConfig}
      gutter={12}
      containerStyle={{
        top: 20,
        right: 20,
      }}
    />
  );
};


export const showSuccessToast = (message) => {
  return toast.success(message, toastConfig.success);
};

export const showErrorToast = (message) => {
  return toast.error(message, toastConfig.error);
};

export const showInfoToast = (message) => {
  return toast(message, toastConfig.info);
};

export const showWarningToast = (message) => {
  return toast(message, toastConfig.warning);
};


export const foodDeliveryToasts = {
  
  loginSuccess: () => showSuccessToast('Login successful! Welcome back!'),
  loginError: (message) => showErrorToast(message || 'Login failed. Please try again.'),
  registrationSuccess: () => showSuccessToast('Registration successful! Welcome to UniMate!'),
  registrationError: (message) => showErrorToast(message || 'Registration failed. Please try again.'),
  logoutSuccess: () => showSuccessToast('Logged out successfully'),
  
  
  shopCreated: () => showSuccessToast('Shop created successfully! You can now start accepting orders.'),
  shopUpdated: () => showSuccessToast('Shop details updated successfully!'),
  shopLoadSuccess: () => showSuccessToast('Shop information loaded successfully!'),
  shopLoadError: () => showErrorToast('Failed to load shop information. Please try again.'),
  
  
  itemAdded: (itemName) => showSuccessToast(`${itemName || 'Item'} added to menu successfully!`),
  itemUpdated: (itemName) => showSuccessToast(`${itemName || 'Item'} updated successfully!`),
  itemDeleted: (itemName) => showSuccessToast(`${itemName || 'Item'} removed from menu!`),
  availabilityUpdated: () => showSuccessToast('Item availability updated!'),
  menuLoadSuccess: () => showSuccessToast('Menu loaded successfully!'),
  menuLoadError: () => showErrorToast('Failed to load menu items'),
  
 
  itemAddedToCart: (itemName) => showSuccessToast(`${itemName || 'Item'} added to cart!`),
  itemRemovedFromCart: (itemName) => showSuccessToast(`${itemName || 'Item'} removed from cart!`),
  cartUpdated: (itemName, quantity) => showSuccessToast(`Cart updated: ${itemName || 'Item'} quantity set to ${quantity}`),
  cartCleared: () => showSuccessToast('Cart cleared successfully!'),
  
 
  orderPlaced: () => showSuccessToast('Order placed successfully! We\'ll notify you of updates.'),
  orderUpdated: () => showSuccessToast('Order status updated!'),
  orderError: (message) => showErrorToast(message || 'Failed to process order. Please try again.'),
  

  requiredField: (fieldName) => showErrorToast(`${fieldName} is required`),
  invalidInput: (fieldName, message) => showErrorToast(`${fieldName}: ${message}`),
  validationError: (message) => showErrorToast(message),
  

  operationSuccess: (operation) => showSuccessToast(`${operation} completed successfully!`),
  operationError: (operation, message) => showErrorToast(`Failed to ${operation}: ${message}`),
  loading: (message) => showInfoToast(message || 'Loading...'),
  connectionError: () => showErrorToast('Connection error. Please check your internet connection.'),
};

export default FoodDeliveryToaster;
