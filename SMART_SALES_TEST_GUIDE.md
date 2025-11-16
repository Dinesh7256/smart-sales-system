# 🧮 Smart Sales Calculator - Complete Testing Guide

## 📋 Test Setup

### Step 1: Sample Products to Create
Create these exact products in your inventory for testing:

#### Product 1: Rice (Weight-based)
- **Product Name**: Rice
- **Product Type**: Weight
- **Base Unit**: gram
- **Cost Price**: ₹40 per kg
- **Selling Price**: ₹60 per kg
- **Stock**: 10 kg

#### Product 2: Oil (Weight-based)
- **Product Name**: Oil
- **Product Type**: Weight  
- **Base Unit**: ml
- **Cost Price**: ₹100 per kg
- **Selling Price**: ₹150 per kg
- **Stock**: 5 kg

#### Product 3: Biscuits (Unit-based)
- **Product Name**: Biscuits
- **Product Type**: Unit
- **Cost Price**: ₹10 per unit
- **Selling Price**: ₹15 per unit
- **Stock**: 100 units

---

## 🧪 Test Scenarios

### TEST 1: Price-based Sales (Most Important)
Test selling by rupee amount - this is where your original error was.

#### Rice Test Cases:
1. **Sell ₹30 worth of Rice**
   - Expected: Revenue = ₹30, Quantity = 500g, Stock = 9.5kg
   - Formula: ₹30 ÷ ₹60 × 1000 = 500g

2. **Sell ₹60 worth of Rice**  
   - Expected: Revenue = ₹60, Quantity = 1kg, Stock = 9kg
   - Formula: ₹60 ÷ ₹60 × 1000 = 1000g

3. **Sell ₹45 worth of Rice**
   - Expected: Revenue = ₹45, Quantity = 750g, Stock = 9.25kg
   - Formula: ₹45 ÷ ₹60 × 1000 = 750g

#### Oil Test Cases:
4. **Sell ₹75 worth of Oil**
   - Expected: Revenue = ₹75, Quantity = 500g, Stock = 4.5kg
   - Formula: ₹75 ÷ ₹150 × 1000 = 500g

#### Biscuits Test Cases:
5. **Sell ₹45 worth of Biscuits**
   - Expected: Revenue = ₹45, Quantity = 3 units, Stock = 97 units
   - Formula: ₹45 ÷ ₹15 = 3 units

### TEST 2: Gram-based Sales
6. **Sell 300g Rice**
   - Expected: Revenue = ₹18, Stock = 9.7kg
   - Formula: 300g ÷ 1000 × ₹60 = ₹18

7. **Sell 250ml Oil**
   - Expected: Revenue = ₹37.50, Stock = 4.75kg
   - Formula: 250ml ÷ 1000 × ₹150 = ₹37.50

### TEST 3: Kilogram-based Sales  
8. **Sell 2kg Rice**
   - Expected: Revenue = ₹120, Stock = 8kg
   - Formula: 2kg × ₹60 = ₹120

9. **Sell 0.5kg Oil**
   - Expected: Revenue = ₹75, Stock = 4.5kg
   - Formula: 0.5kg × ₹150 = ₹75

### TEST 4: Unit-based Sales
10. **Sell 5 Biscuits**
    - Expected: Revenue = ₹75, Stock = 95 units
    - Formula: 5 × ₹15 = ₹75

---

## 🎯 Expected Results Summary

| Test | Product | Sale Type | Input | Expected Revenue | Expected Stock Change | Expected Remaining Stock |
|------|---------|-----------|-------|------------------|----------------------|-------------------------|
| 1    | Rice    | Price     | ₹30   | ₹30              | -0.5kg               | 9.5kg                  |
| 2    | Rice    | Price     | ₹60   | ₹60              | -1kg                 | 9kg                    |
| 3    | Rice    | Price     | ₹45   | ₹45              | -0.75kg              | 9.25kg                 |
| 4    | Oil     | Price     | ₹75   | ₹75              | -0.5kg               | 4.5kg                  |
| 5    | Biscuits| Price     | ₹45   | ₹45              | -3 units             | 97 units               |
| 6    | Rice    | Grams     | 300g  | ₹18              | -0.3kg               | 9.7kg                  |
| 7    | Oil     | Grams     | 250ml | ₹37.50           | -0.25kg              | 4.75kg                 |
| 8    | Rice    | Kg        | 2kg   | ₹120             | -2kg                 | 8kg                    |
| 9    | Oil     | Kg        | 0.5kg | ₹75              | -0.5kg               | 4.5kg                  |
| 10   | Biscuits| Units     | 5     | ₹75              | -5 units             | 95 units               |

---

## 🔍 How to Verify Results

### After Each Sale:
1. **Check Dashboard Revenue**: Should show exact expected revenue
2. **Check Inventory Stock**: Should show correct remaining stock
3. **Check Backend Logs**: Look for authentication and calculation logs

### Backend Debug Output to Look For:
```
🔐 Authentication attempt - Headers: Present
🔑 JWT Strategy called with payload: {...}
✅ User authenticated successfully: user@email.com
```

### Frontend Console Logs:
- No 401 errors
- Successful sale confirmations
- Correct calculation displays

---

## 🚨 Common Issues to Check

1. **Authentication Errors**: Make sure you're logged in
2. **Stock Insufficient**: Make sure you have enough stock
3. **Calculation Errors**: Compare actual vs expected results
4. **Unit Confusion**: Weight products should deduct in kg, unit products in pieces

---

## 📝 Testing Instructions

1. **Setup**: Create the 3 sample products above
2. **Login**: Make sure you're authenticated  
3. **Test Each Scenario**: Go through tests 1-10 systematically
4. **Record Results**: Note any discrepancies from expected results
5. **Report Issues**: Tell me exactly which test failed and what you got vs expected

**Start with Test 1 (₹30 Rice sale) - this is the most critical test that was failing before!**