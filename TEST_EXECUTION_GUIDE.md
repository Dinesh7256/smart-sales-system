# 🚀 Smart Sales Calculator - Complete Test Execution Guide

## 🎯 Current Status
✅ **Frontend Server**: Running on http://localhost:3000  
✅ **Backend Server**: Running on http://localhost:5001  
✅ **Test Files Created**: Manual & Automated test suites ready  

---

## 📋 Quick Start: Choose Your Testing Method

### Method 1: Manual Testing (Recommended First)
**Time**: 10-15 minutes  
**Best For**: Verifying UI and user experience

1. **Open**: http://localhost:3000
2. **Follow**: `DIGITAL_KIRANA_TEST_PLAN.md`  
3. **Create**: Two test products as specified
4. **Execute**: TC-1 through TC-6 step by step

### Method 2: Automated API Testing  
**Time**: 2-3 minutes  
**Best For**: Backend logic verification

1. **Open**: Browser DevTools (F12)
2. **Copy**: Test script from `DIGITAL_KIRANA_TEST_PLAN.md` 
3. **Run**: `runCompleteTest()`

### Method 3: Unit Testing (Professional)
**Time**: 5 minutes setup + instant results
**Best For**: Continuous integration

```bash
cd frontend
npm test SalesPadPage.test.js
```

---

## 🎮 Step-by-Step Manual Testing

### Phase 1: Product Setup (5 minutes)

1. **Login** to your app at http://localhost:3000

2. **Go to Inventory** → Click "Add New Product"

3. **Create Product 1**: Parle-G Biscuit
   - Name: "Parle-G Biscuit"  
   - Type: Unit
   - Stock: 100 packets
   - Cost: ₹8, Selling: ₹10

4. **Create Product 2**: Sugar (Loose)
   - Name: "Sugar (Loose)"
   - Type: Weight  
   - Base Unit: gram
   - Stock: 50000 (this is 50kg)
   - Cost: ₹30, Selling: ₹40

### Phase 2: Foundation Tests (2 minutes)

5. **TC-1**: Go back to Inventory → Verify both products are listed ✅

6. **TC-2**: Go to Smart Sales Pad → Verify only "Sugar (Loose)" appears ✅

### Phase 3: Smart Sales Tests (8 minutes)

7. **TC-3**: Test 500g Sale
   - Select Sugar → Enter 500 → Click "500g" → Confirm
   - Expected: Stock becomes 49,500g

8. **TC-4**: Test 1kg Sale  
   - Select Sugar → Enter 1 → Click "1kg" → Confirm
   - Expected: Stock becomes 48,500g

9. **TC-5**: Test ₹50 Price Sale (CRITICAL)
   - Select Sugar → Enter 50 → Click "Sell for ₹50" → Confirm
   - Expected: Stock becomes 47,250g, Dashboard shows +₹50

10. **TC-6**: Test Error Handling
    - Don't select product → Enter 20 → Click "Sell for ₹20"  
    - Expected: Error message, no sale created

---

## 🔍 What to Look For

### ✅ Success Indicators:
- Stock quantities decrease correctly after each sale
- Dashboard revenue shows exact customer payment amounts
- Error messages appear for invalid operations
- No browser console errors
- Backend logs show successful authentication

### ❌ Failure Indicators:  
- Stock doesn't change after sales
- Dashboard shows wrong revenue amounts (like ₹17 instead of ₹50)
- App crashes or shows white screen
- 401 Authentication errors
- Console errors during sales

---

## 🐛 If Tests Fail

### Common Issues & Fixes:

**Issue**: 401 Authentication Error
- **Fix**: Make sure you're logged in first

**Issue**: Dashboard shows wrong revenue
- **Fix**: Already fixed in latest code, restart servers

**Issue**: Stock doesn't decrease
- **Fix**: Check backend logs for calculation errors

**Issue**: Products don't appear in Sales Pad
- **Fix**: Make sure product type is set to "weight"

---

## 📊 Test Results Template

Copy this and fill in your results:

```
🏪 DIGITAL KIRANA STORE - TEST RESULTS
=====================================

TC-1 Inventory Check: ✅ PASS / ❌ FAIL
- Both products visible: ___

TC-2 Sales Pad Filter: ✅ PASS / ❌ FAIL  
- Only Sugar visible: ___

TC-3 500g Sale: ✅ PASS / ❌ FAIL
- Stock after: ___g (expected: 49,500g)
- Revenue: ₹___ (expected: ₹20)

TC-4 1kg Sale: ✅ PASS / ❌ FAIL
- Stock after: ___g (expected: 48,500g)  
- Revenue: ₹___ (expected: ₹40)

TC-5 ₹50 Price Sale: ✅ PASS / ❌ FAIL
- Stock after: ___g (expected: 47,250g)
- Revenue: ₹___ (expected: ₹50) ← CRITICAL!

TC-6 Error Handling: ✅ PASS / ❌ FAIL
- Error message shown: ___
- No sale created: ___

Overall Result: ✅ PASS / ❌ FAIL
```

---

## 🎯 Next Steps

1. **Start Manual Testing**: Follow Phase 1-3 above
2. **Record Results**: Use the template above  
3. **Report Issues**: Tell me which specific test failed and what you saw vs expected
4. **If All Pass**: We'll proceed to merge the feature branch to main!

**The most critical test is TC-5 (₹50 price sale showing exact ₹50 revenue). This was your original issue!**

Ready to begin? Start with creating the two products and let me know your results! 🚀