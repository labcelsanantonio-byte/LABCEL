#!/usr/bin/env python3

import requests
import sys
from datetime import datetime
import json

class LABCELAPITester:
    def __init__(self, base_url="https://custom-cases-3.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response keys: {list(response_data.keys())}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e)
            })
            return False, {}

    def test_health_check(self):
        """Test health check endpoint"""
        return self.run_test("Health Check", "GET", "health", 200)

    def test_seed_data(self):
        """Test seeding initial data"""
        return self.run_test("Seed Data", "POST", "seed", 200)

    def test_get_products(self):
        """Test getting products with correct prices ($180 and $280)"""
        success, response = self.run_test("Get Products", "GET", "products", 200)
        
        if success and response:
            # Check if we have the expected products with correct prices
            products = response
            expected_products = {
                "Funda Personalizada Una Pieza": 180.00,
                "Funda Personalizada Dos Piezas - Uso Rudo": 280.00
            }
            
            found_products = {}
            for product in products:
                if product['name'] in expected_products:
                    found_products[product['name']] = product['price']
            
            print(f"   Found products: {found_products}")
            
            # Verify prices
            all_correct = True
            for name, expected_price in expected_products.items():
                if name in found_products:
                    if found_products[name] == expected_price:
                        print(f"   ✅ {name}: ${found_products[name]} (correct)")
                    else:
                        print(f"   ❌ {name}: ${found_products[name]} (expected ${expected_price})")
                        all_correct = False
                else:
                    print(f"   ❌ Missing product: {name}")
                    all_correct = False
            
            if not all_correct:
                self.failed_tests.append({
                    'name': 'Product Prices Validation',
                    'error': 'Product prices do not match expected values'
                })
                return False
            
            return True
        return success

    def test_get_phone_brands(self):
        """Test getting phone brands"""
        return self.run_test("Get Phone Brands", "GET", "phone-brands", 200)

    def test_get_phone_models(self):
        """Test getting phone models"""
        return self.run_test("Get Phone Models", "GET", "phone-models", 200)

    def test_get_phone_models_by_brand(self):
        """Test getting phone models by brand"""
        return self.run_test("Get Phone Models by Brand", "GET", "phone-models?brand_id=brand_apple", 200)

    def test_create_order(self):
        """Test creating an order with new payment method 'recoger_tienda'"""
        order_data = {
            "items": [
                {
                    "product_id": "prod_funda_normal",
                    "product_name": "Funda Personalizada Una Pieza",
                    "quantity": 1,
                    "price": 180.00,
                    "phone_brand": "Apple",
                    "phone_model": "iPhone 15",
                    "custom_image_url": None,
                    "preview_image_url": None
                }
            ],
            "customer_name": "Test Customer",
            "customer_email": "test@example.com",
            "customer_phone": "+1234567890",
            "customer_whatsapp": "+1234567890",
            "shipping_address": "Test Address, San Antonio, TX",
            "payment_method": "recoger_tienda",  # New payment method
            "notes": "Test order for pickup in store"
        }
        
        success, response = self.run_test("Create Order with Store Pickup", "POST", "orders", 200, order_data)
        
        if success and response:
            print(f"   Order ID: {response.get('order_id')}")
            print(f"   Total: ${response.get('total')}")
            print(f"   Status: {response.get('status')}")
        
        return success, response

    def test_track_order(self, order_id):
        """Test tracking an order"""
        return self.run_test("Track Order", "GET", f"orders/track/{order_id}", 200)

    def test_get_single_product(self):
        """Test getting a single product"""
        return self.run_test("Get Single Product", "GET", "products/prod_funda_normal", 200)

    def print_summary(self):
        """Print test summary"""
        print(f"\n{'='*50}")
        print(f"📊 TEST SUMMARY")
        print(f"{'='*50}")
        print(f"Tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {self.tests_run - self.tests_passed}")
        print(f"Success rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ FAILED TESTS:")
            for test in self.failed_tests:
                print(f"  - {test['name']}")
                if 'error' in test:
                    print(f"    Error: {test['error']}")
                else:
                    print(f"    Expected: {test['expected']}, Got: {test['actual']}")

def main():
    print("🚀 Starting LABCEL San Antonio API Tests")
    print("="*50)
    
    tester = LABCELAPITester()
    
    # Test basic endpoints
    tester.test_health_check()
    
    # Seed data first
    tester.test_seed_data()
    
    # Test product endpoints
    tester.test_get_products()
    tester.test_get_single_product()
    
    # Test phone data endpoints
    tester.test_get_phone_brands()
    tester.test_get_phone_models()
    tester.test_get_phone_models_by_brand()
    
    # Test order creation
    success, order_response = tester.test_create_order()
    if success and 'order_id' in order_response:
        # Test order tracking
        tester.test_track_order(order_response['order_id'])
    
    # Print summary
    tester.print_summary()
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())