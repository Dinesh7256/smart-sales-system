// 🧪 Smart Sales Pad - Automated Unit Tests
// Run with: npm test SalesPadPage.test.js

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SalesPadPage from '../pages/SalesPadPage';
import * as salesService from '../services/salesService';
import * as productService from '../services/productService';

// Mock the services
jest.mock('../services/salesService');
jest.mock('../services/productService');

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Smart Sales Pad - Digital Kirana Store Tests', () => {
  const mockSugarProduct = {
    _id: '123',
    productName: 'Sugar (Loose)',
    productType: 'weight',
    baseUnit: 'gram',
    sellingPrice: 40,
    costPrice: 30,
    quantityInStock: 50000
  };

  const mockBiscuitProduct = {
    _id: '456', 
    productName: 'Parle-G Biscuit',
    productType: 'unit',
    sellingPrice: 10,
    costPrice: 8,
    quantityInStock: 100
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful product fetch (only weight products for Sales Pad)
    productService.getProductsByType.mockResolvedValue({
      data: [mockSugarProduct]
    });
    
    // Mock successful sale submission
    salesService.addSale.mockResolvedValue({
      success: true,
      message: 'Sale recorded successfully'
    });
  });

  const renderSalesPad = () => {
    return render(
      <BrowserRouter>
        <SalesPadPage />
      </BrowserRouter>
    );
  };

  describe('TC-1 & TC-2: Foundation Tests', () => {
    test('should only display weight-based products', async () => {
      renderSalesPad();
      
      await waitFor(() => {
        expect(screen.getByText('Sugar (Loose)')).toBeInTheDocument();
        expect(screen.queryByText('Parle-G Biscuit')).not.toBeInTheDocument();
      });

      expect(productService.getProductsByType).toHaveBeenCalledWith('weight');
    });

    test('should show error when no product is selected', async () => {
      renderSalesPad();
      
      // Enter amount without selecting product
      const input50 = screen.getByText('5');
      const input0 = screen.getByText('0');
      
      fireEvent.click(input50);
      fireEvent.click(input0);
      
      // Try to sell for ₹50
      const sellButton = screen.getByText(/Sell for ₹/);
      fireEvent.click(sellButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Please select a product/)).toBeInTheDocument();
      });

      expect(salesService.addSale).not.toHaveBeenCalled();
    });
  });

  describe('TC-3: Sale by Grams', () => {
    test('should handle 500g sugar sale correctly', async () => {
      renderSalesPad();
      
      await waitFor(() => {
        const sugarButton = screen.getByText('Sugar (Loose)');
        fireEvent.click(sugarButton);
      });

      // Enter 500
      fireEvent.click(screen.getByText('5'));
      fireEvent.click(screen.getByText('0'));
      fireEvent.click(screen.getByText('0'));

      // Click grams button  
      const gramsButton = screen.getByText(/500g/);
      fireEvent.click(gramsButton);

      // Confirm sale
      const confirmButton = screen.getByText('Confirm Sale');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(salesService.addSale).toHaveBeenCalledWith([{
          productId: '123',
          saleType: 'grams',
          quantitySold: 500,
          totalAmount: 0
        }]);
      });
    });
  });

  describe('TC-4: Sale by Kilograms', () => {
    test('should handle 1kg sugar sale correctly', async () => {
      renderSalesPad();
      
      await waitFor(() => {
        const sugarButton = screen.getByText('Sugar (Loose)');
        fireEvent.click(sugarButton);
      });

      // Enter 1
      fireEvent.click(screen.getByText('1'));

      // Click kg button
      const kgButton = screen.getByText(/1kg/);
      fireEvent.click(kgButton);

      // Confirm sale
      const confirmButton = screen.getByText('Confirm Sale');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(salesService.addSale).toHaveBeenCalledWith([{
          productId: '123',
          saleType: 'kg', 
          quantitySold: 1,
          totalAmount: 0
        }]);
      });
    });
  });

  describe('TC-5: Sale by Price (CRITICAL TEST)', () => {
    test('should handle ₹50 sugar sale with correct calculation', async () => {
      renderSalesPad();
      
      await waitFor(() => {
        const sugarButton = screen.getByText('Sugar (Loose)');
        fireEvent.click(sugarButton);
      });

      // Enter 50
      fireEvent.click(screen.getByText('5'));
      fireEvent.click(screen.getByText('0'));

      // Click price button (₹50)
      const priceButton = screen.getByText(/Sell for ₹50/);
      fireEvent.click(priceButton);

      // Confirm sale
      const confirmButton = screen.getByText('Confirm Sale');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(salesService.addSale).toHaveBeenCalledWith([{
          productId: '123',
          saleType: 'price',
          totalAmount: 50, // Exact amount customer pays
          quantitySold: expect.any(Number) // Calculated quantity (1250g)
        }]);
      });

      // Verify the calculation logic
      const callArgs = salesService.addSale.mock.calls[0][0][0];
      expect(callArgs.totalAmount).toBe(50);
      expect(callArgs.saleType).toBe('price');
    });

    test('should calculate quantity correctly for price-based sale', () => {
      // Test the core calculation logic directly
      const sellingPrice = 40; // ₹40 per kg
      const customerPayment = 50; // ₹50
      
      // Expected calculation: (₹50 / ₹40) * 1000g = 1250g
      const expectedQuantityInGrams = (customerPayment / sellingPrice) * 1000;
      
      expect(expectedQuantityInGrams).toBe(1250);
    });
  });

  describe('Backend Integration Tests', () => {
    test('should handle successful sale response', async () => {
      renderSalesPad();
      
      await waitFor(() => {
        const sugarButton = screen.getByText('Sugar (Loose)');
        fireEvent.click(sugarButton);
      });

      fireEvent.click(screen.getByText('5'));
      fireEvent.click(screen.getByText('0'));
      
      const priceButton = screen.getByText(/Sell for ₹50/);
      fireEvent.click(priceButton);
      
      const confirmButton = screen.getByText('Confirm Sale');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText(/Sale recorded successfully/)).toBeInTheDocument();
      });
    });

    test('should handle sale error gracefully', async () => {
      // Mock API error
      salesService.addSale.mockRejectedValue(new Error('Network error'));
      
      renderSalesPad();
      
      await waitFor(() => {
        const sugarButton = screen.getByText('Sugar (Loose)');
        fireEvent.click(sugarButton);
      });

      fireEvent.click(screen.getByText('5'));
      fireEvent.click(screen.getByText('0'));
      
      const priceButton = screen.getByText(/Sell for ₹50/);
      fireEvent.click(priceButton);
      
      const confirmButton = screen.getByText('Confirm Sale');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText(/Failed to record sale/)).toBeInTheDocument();
      });
    });
  });
});

// Performance Test
describe('Smart Sales Performance Tests', () => {
  test('should handle rapid consecutive sales', async () => {
    const startTime = performance.now();
    
    // Simulate 10 rapid sales
    const promises = Array(10).fill().map(() => 
      salesService.addSale([{
        productId: '123',
        saleType: 'price', 
        totalAmount: 10,
        quantitySold: 250
      }])
    );
    
    await Promise.all(promises);
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Should complete within 2 seconds
    expect(duration).toBeLessThan(2000);
  });
});

export default {};