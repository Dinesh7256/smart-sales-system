# 🏪 Digital Kirana Store - Comprehensive Test Plan

## 📋 Test Setup Status
✅ Frontend Server: Running on http://localhost:3000  
✅ Backend Server: Running on http://localhost:5001  
✅ MongoDB: Connected and ready  

---

## 🛒 Test Products Setup

### Product 1: Parle-G Biscuit (Unit-based)
- **Name**: "Parle-G Biscuit"
- **Product Type**: unit
- **Quantity in Stock**: 100 (packets)
- **Cost Price**: ₹8 per packet
- **Selling Price**: ₹10 per packet

### Product 2: Sugar (Loose) (Weight-based)  
- **Name**: "Sugar (Loose)"
- **Product Type**: weight
- **Base Unit**: gram
- **Quantity in Stock**: 50000 (50kg in grams)
- **Cost Price**: ₹30 per kg
- **Selling Price**: ₹40 per kg

---

## 🧪 Test Plan 1: Foundation Tests

### TC-1: Inventory Verification
**Component**: Inventory Page  
**Steps**:
1. Go to Inventory page from dashboard
2. Check product list

**Expected Result**: ✅ Both "Parle-G Biscuit" and "Sugar (Loose)" visible in inventory

### TC-2: Smart Sales Pad Product Filter  
**Component**: Sales Pad UI
**Steps**:
1. Go to Smart Sales Pad from dashboard
2. Check available products

**Expected Result**: ✅ Only "Sugar (Loose)" button visible (weight-based products only)

---

## 🎯 Test Plan 2: Core Smart Sales Logic

### TC-3: Sale by Grams
**Starting Stock**: 50,000g Sugar
**Steps**:
1. Tap [Sugar (Loose)] button
2. Enter [5][0][0] on calculator  
3. Tap [500g] button
4. Confirm sale

**Expected Results**:
- ✅ Sale recorded successfully
- ✅ Stock becomes 49,500g (50,000 - 500)
- ✅ Revenue = ₹20 (500g ÷ 1000 × ₹40)

### TC-4: Sale by Kilograms
**Starting Stock**: 49,500g Sugar (after TC-3)
**Steps**:
1. Tap [Sugar (Loose)] button
2. Enter [1] on calculator
3. Tap [1kg] button  
4. Confirm sale

**Expected Results**:
- ✅ Sale recorded successfully
- ✅ Stock becomes 48,500g (49,500 - 1,000)
- ✅ Revenue = ₹40 (1kg × ₹40)

### TC-5: Sale by Price (CRITICAL TEST)
**Starting Stock**: 48,500g Sugar (after TC-4)
**Steps**:
1. Tap [Sugar (Loose)] button
2. Enter [5][0] on calculator (₹50)
3. Tap [Sell for ₹50] button
4. Confirm sale

**Expected Results**:
- ✅ Sale recorded successfully  
- ✅ Stock becomes 47,250g (48,500 - 1,250g)
- ✅ Revenue = ₹50 (exact amount customer paid)
- ✅ Quantity = 1,250g (₹50 ÷ ₹40 × 1000g)

### TC-6: Error Handling
**Steps**:
1. Don't select any product
2. Enter [2][0] on calculator
3. Tap [Sell for ₹20] button

**Expected Results**:
- ❌ No sale created
- ✅ Error message: "Please select a product first"
- ✅ App doesn't crash

---

## 🤖 Automated Testing Helper

### Browser Console Test Script
Copy this into browser DevTools console after logging in:

\`\`\`javascript
// Digital Kirana Store - Automated Test Helper
const API_URL = 'http://localhost:5001/api/v1';
const getHeaders = () => ({
    'Authorization': \`Bearer \${localStorage.getItem('token')}\`,
    'Content-Type': 'application/json'
});

// Test Helper: Create Products
async function createTestProducts() {
    console.log('🛒 Creating Digital Kirana Store products...');
    
    const products = [
        {
            productName: 'Parle-G Biscuit',
            productType: 'unit',
            costPrice: 8,
            sellingPrice: 10,
            quantityInStock: 100
        },
        {
            productName: 'Sugar (Loose)',
            productType: 'weight',
            baseUnit: 'gram',
            costPrice: 30,
            sellingPrice: 40,
            quantityInStock: 50000
        }
    ];
    
    for (const product of products) {
        try {
            const response = await fetch(\`\${API_URL}/products\`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(product)
            });
            const result = await response.json();
            console.log(\`✅ Created \${product.productName}:\`, result);
        } catch (error) {
            console.error(\`❌ Failed to create \${product.productName}:\`, error);
        }
    }
}

// Test Helper: Verify Products
async function verifyProducts() {
    try {
        const response = await fetch(\`\${API_URL}/products\`, { headers: getHeaders() });
        const result = await response.json();
        
        const biscuit = result.data.find(p => p.productName === 'Parle-G Biscuit');
        const sugar = result.data.find(p => p.productName === 'Sugar (Loose)');
        
        console.log('📦 TC-1 Inventory Check:');
        console.log(\`Parle-G Biscuit: \${biscuit ? '✅ Found' : '❌ Missing'}\`);
        console.log(\`Sugar (Loose): \${sugar ? '✅ Found' : '❌ Missing'}\`);
        
        return { biscuit, sugar };
    } catch (error) {
        console.error('❌ Failed to verify products:', error);
        return null;
    }
}

// Test Helper: Smart Sales Tests
async function testSmartSales(sugarId) {
    console.log('🎯 Running Smart Sales Tests...');
    
    // TC-3: Sale by Grams
    console.log('\\n🧪 TC-3: Testing 500g sale...');
    await testSale(sugarId, 'grams', 500, 0, 'TC-3');
    
    // TC-4: Sale by Kg  
    console.log('\\n🧪 TC-4: Testing 1kg sale...');
    await testSale(sugarId, 'kg', 1, 0, 'TC-4');
    
    // TC-5: Sale by Price (CRITICAL)
    console.log('\\n🧪 TC-5: Testing ₹50 price sale...');
    await testSale(sugarId, 'price', 0, 50, 'TC-5');
}

async function testSale(productId, saleType, quantity, amount, testId) {
    const saleData = {
        productId: productId,
        saleType: saleType
    };
    
    if (saleType === 'price') {
        saleData.totalAmount = amount;
        saleData.quantitySold = 0;
    } else {
        saleData.quantitySold = quantity;  
        saleData.totalAmount = 0;
    }
    
    try {
        const response = await fetch(\`\${API_URL}/sales\`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                date: new Date().toISOString(),
                itemsSold: [saleData]
            })
        });
        
        const result = await response.json();
        console.log(\`✅ \${testId} Sale successful:\`, result);
        return result;
    } catch (error) {
        console.error(\`❌ \${testId} Sale failed:\`, error);
        return null;
    }
}

// Run Complete Test Suite
async function runCompleteTest() {
    console.log('🚀 Digital Kirana Store - Complete Test Suite');
    console.log('=====================================\\n');
    
    // Setup
    await createTestProducts();
    
    // Verify
    const products = await verifyProducts();
    if (!products || !products.sugar) {
        console.log('❌ Setup failed. Please check products.');
        return;
    }
    
    // Test Smart Sales
    await testSmartSales(products.sugar._id);
    
    console.log('\\n✅ Complete test suite finished!');
}

// Quick Commands
console.log(\`
🏪 DIGITAL KIRANA STORE - TEST COMMANDS
======================================

1. Setup products: createTestProducts()
2. Verify products: verifyProducts()  
3. Run all tests: runCompleteTest()

⚠️ Make sure you're logged in first!
\`);
\`\`\`

---

## 📝 Manual Test Checklist

### Before Starting:
- [ ] Login to your application
- [ ] Both servers running
- [ ] Create the two test products above

### TC-1: Inventory Check
- [ ] Go to Inventory page
- [ ] See both products listed
- [ ] Note down their stock quantities

### TC-2: Sales Pad Filter
- [ ] Go to Smart Sales Pad  
- [ ] Only see Sugar (Loose) button
- [ ] Parle-G not visible (correct!)

### TC-3: 500g Sugar Sale
- [ ] Select Sugar (Loose)
- [ ] Enter 500
- [ ] Click "500g" 
- [ ] Confirm sale
- [ ] Check stock decreased by 500g

### TC-4: 1kg Sugar Sale  
- [ ] Select Sugar (Loose)
- [ ] Enter 1
- [ ] Click "1kg"
- [ ] Confirm sale  
- [ ] Check stock decreased by 1000g

### TC-5: ₹50 Sugar Sale (CRITICAL)
- [ ] Select Sugar (Loose)
- [ ] Enter 50
- [ ] Click "Sell for ₹50"
- [ ] Confirm sale
- [ ] Check stock decreased by 1250g
- [ ] Check dashboard shows +₹50 revenue

### TC-6: Error Test
- [ ] Don't select product
- [ ] Enter 20
- [ ] Click "Sell for ₹20"
- [ ] See error message
- [ ] No sale created

---

## 🎯 Success Criteria

**PASS**: All 6 test cases work as expected
**CRITICAL**: TC-5 (₹50 price sale) must show exact ₹50 revenue

**Start with TC-1 and TC-2 to verify your setup, then proceed to the Smart Sales tests!**