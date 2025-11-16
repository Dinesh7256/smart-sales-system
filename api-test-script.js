// 🧪 Smart Sales Calculator API Test Script
// Run this in browser console after logging in to test backend directly

// Test Helper Functions
const API_URL = 'http://localhost:5001/api/v1';
const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
});

// Test 1: Create Sample Products (Run this first)
async function createSampleProducts() {
    console.log('🏗️ Creating sample products...');
    
    const products = [
        {
            productName: 'Rice',
            productType: 'weight',
            baseUnit: 'gram',
            costPrice: 40,
            sellingPrice: 60,
            quantityInStock: 10
        },
        {
            productName: 'Oil',
            productType: 'weight', 
            baseUnit: 'ml',
            costPrice: 100,
            sellingPrice: 150,
            quantityInStock: 5
        },
        {
            productName: 'Biscuits',
            productType: 'unit',
            costPrice: 10,
            sellingPrice: 15,
            quantityInStock: 100
        }
    ];
    
    for (const product of products) {
        try {
            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(product)
            });
            const result = await response.json();
            console.log(`✅ Created ${product.productName}:`, result);
        } catch (error) {
            console.error(`❌ Failed to create ${product.productName}:`, error);
        }
    }
}

// Test 2: Get Products and IDs
async function getProducts() {
    console.log('📋 Fetching products...');
    
    try {
        const response = await fetch(`${API_URL}/products`, {
            headers: getAuthHeaders()
        });
        const result = await response.json();
        console.log('📦 Your products:', result.data);
        return result.data;
    } catch (error) {
        console.error('❌ Failed to fetch products:', error);
        return [];
    }
}

// Test 3: Price-based Sale Test
async function testPriceSale(productId, productName, totalAmount) {
    console.log(`💰 Testing ₹${totalAmount} sale of ${productName}...`);
    
    const saleData = [
        {
            productId: productId,
            saleType: 'price',
            totalAmount: totalAmount,
            quantitySold: 0 // Will be calculated by backend
        }
    ];
    
    try {
        const response = await fetch(`${API_URL}/sales`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                date: new Date().toISOString(),
                itemsSold: saleData
            })
        });
        
        const result = await response.json();
        console.log(`✅ Sale result:`, result);
        return result;
    } catch (error) {
        console.error(`❌ Sale failed:`, error);
        return null;
    }
}

// Test 4: Gram-based Sale Test  
async function testGramSale(productId, productName, grams) {
    console.log(`⚖️ Testing ${grams}g sale of ${productName}...`);
    
    const saleData = [
        {
            productId: productId,
            saleType: 'grams',
            quantitySold: grams,
            totalAmount: 0 // Will be calculated by backend
        }
    ];
    
    try {
        const response = await fetch(`${API_URL}/sales`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                date: new Date().toISOString(),
                itemsSold: saleData
            })
        });
        
        const result = await response.json();
        console.log(`✅ Sale result:`, result);
        return result;
    } catch (error) {
        console.error(`❌ Sale failed:`, error);
        return null;
    }
}

// Test 5: Complete Test Suite
async function runCompleteTest() {
    console.log('🚀 Starting Smart Sales Calculator Test Suite...');
    
    // Step 1: Get products
    const products = await getProducts();
    if (products.length === 0) {
        console.log('⚠️ No products found. Creating sample products...');
        await createSampleProducts();
        return console.log('✅ Products created! Run runCompleteTest() again.');
    }
    
    // Find our test products
    const rice = products.find(p => p.productName === 'Rice');
    const oil = products.find(p => p.productName === 'Oil');
    const biscuits = products.find(p => p.productName === 'Biscuits');
    
    if (!rice || !oil || !biscuits) {
        console.log('⚠️ Test products not found. Creating them...');
        await createSampleProducts();
        return console.log('✅ Products created! Run runCompleteTest() again.');
    }
    
    console.log('📦 Test products found:', {
        rice: rice._id,
        oil: oil._id, 
        biscuits: biscuits._id
    });
    
    // Step 2: Run critical price-based tests
    console.log('\n💰 TESTING PRICE-BASED SALES...');
    await testPriceSale(rice._id, 'Rice', 30);      // Should give 500g
    await testPriceSale(rice._id, 'Rice', 60);      // Should give 1000g  
    await testPriceSale(oil._id, 'Oil', 75);        // Should give 500g
    await testPriceSale(biscuits._id, 'Biscuits', 45); // Should give 3 units
    
    // Step 3: Run gram-based tests
    console.log('\n⚖️ TESTING GRAM-BASED SALES...');
    await testGramSale(rice._id, 'Rice', 300);      // Should cost ₹18
    await testGramSale(oil._id, 'Oil', 250);        // Should cost ₹37.50
    
    console.log('\n✅ Test suite completed! Check results above.');
}

// Quick Test Functions (copy-paste ready)
console.log(`
🧪 SMART SALES CALCULATOR API TESTS
=====================================

Copy and paste these commands one by one:

1. Create sample products:
   createSampleProducts()

2. Get all products:  
   getProducts()

3. Run complete test suite:
   runCompleteTest()

4. Test specific price sale (replace IDs):
   testPriceSale('PRODUCT_ID', 'Rice', 30)

5. Test specific gram sale:
   testGramSale('PRODUCT_ID', 'Rice', 300)

⚠️ Make sure you're logged in first!
`);