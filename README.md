# Monk Commerce Coupons Management API

## Overview
This project implements a **product-wise coupon management API** for an e-commerce platform using **Node.js, Express, and Prisma ORM** with **PostgreSQL**.

## Implemented Cases

### Product-wise Coupons
- Coupons that apply a percentage discount to a specific product in the cart.
- Coupon structure includes `productId` and `discount` percentage.
- API endpoints to:
  - Create a coupon
  - Retrieve all coupons
  - Retrieve a coupon by ID
  - Update a coupon by ID
  - Delete a coupon by ID
  - Fetch applicable coupons for a given cart
  - Apply a specific coupon to a cart, updating item discounts and final price.

## Unimplemented Cases

### Cart-wise Coupons
- Discounts applied to the entire cart based on total amount thresholds.
- **Reason:** Focus was on product-wise coupons to ensure clean, maintainable code within time constraints.

### BxGy (Buy X Get Y) Coupons
- Complex buy-get-free product deals with repetition limits.
- **Reason:** Requires more complex data modeling and logic, deferred for future implementation.

### Coupon Stacking and Combination Rules
- Applying multiple coupons simultaneously.
- **Reason:** Not supported in current scope.

### Expiration Dates and Usage Limits
- Coupons with validity periods or usage caps.
- **Reason:** Not implemented, but schema can be extended to support this.

## Limitations
- Only product-wise coupons are supported currently.
- Discounts are simple percentage reductions on product total price.
- No support for coupon stacking or combining multiple coupons.
- No expiration date or usage limit enforcement.
- No user-specific coupon eligibility or advanced conditions.
- Cart is assumed to be a simple list of items with `productId`, `quantity`, and `price`.
- No persistent cart or order management implemented.

## Assumptions
- Product IDs are unique integers and valid.
- Prices and quantities in the cart are positive numbers.
- Only one coupon is applied at a time.
- Coupon discount percentages are between 0 and 100.
- The cart data sent to the API is trusted and validated on the client side.
- The system does not handle concurrency or race conditions for coupon usage.

## Bonus Features (Planned / Partial)

### Expiration Dates
- Schema can be extended with an optional `expirationDate` field in the Coupon model.

### Unit Tests
- Basic unit tests can be added using **Jest** or **Mocha** to cover coupon creation, applicability, and application logic.

## How to Run

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

## Future Improvements
- Add coupon expiration and usage limits.
- Support coupon stacking and combination rules.
- Add user authentication and coupon eligibility.
- Write comprehensive unit and integration tests.
- Improve error handling and input validation.
