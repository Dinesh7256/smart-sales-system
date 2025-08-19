# Smart Sales System - Backend API

## Overview

A backend API for managing sales and inventory, built with Node.js, Express, MongoDB, and JWT authentication.  
Features include user authentication, product CRUD operations, and email-based password reset.

---

# Getting Started

cd backend
npm start

# .env file

PORT = 5001
MONGODB_URI = mongodb://127.0.0.1:27017/
EMAIL_ID = email_id
SENDGRID_API_KEY = YOUR SENDGRID_API_KEY

# API Endpoints

Auth (Public)--
http://localhost:5001/api/v1/

POST /signup → Register user
POST /login → Login & get JWT
POST /forgot-password → Send reset link
PATCH /reset-password/:token → Reset password
Products (Protected - requires Authorization: Bearer <token>)

http://localhost:5001/api/v1/

POST /products → Create product
GET /products → Get all products
GET /products/:id → Get product by ID
GET /products/search?minPrice=&maxPrice= → Filter by price
PUT /products/:id → Update product
DELETE /products/:id → Delete product
