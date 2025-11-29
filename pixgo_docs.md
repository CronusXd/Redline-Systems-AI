# PixGo API Documentation

## Authentication
All API requests require authentication using your API key in the `X-API-Key` header.

## Base URL
`https://pixgo.org`

## Endpoints

### 1. Create Payment
**POST** `/api/v1/payment/create`

Creates a new PIX payment request.

**Parameters:**
- `amount` (Required): Minimum R$ 10.00.
- `customer_name` (Optional): Max 100 chars.
- `customer_cpf` (Optional): 11 digits (CPF) or 14 digits (CNPJ).
- `customer_email` (Optional): Valid email, max 255 chars.
- `customer_phone` (Optional): Phone with area code, max 20 chars.
- `customer_address` (Optional): Max 500 chars.
- `external_id` (Optional): Max 50 chars.
- `description` (Optional): Max 200 chars.

**Success Response (201):**
Returns payment details including the QR Code (copy-paste) and ID.

### 2. Check Payment Status
**GET** `/api/v1/payment/{id}/status`

Retrieves the current status of a payment.

**Status Values:**
- `pending`: Awaiting payment.
- `completed`: Payment confirmed.
- `expired`: Payment expired (20 minutes).
- `cancelled`: Payment cancelled.

### 3. Get Payment Details
**GET** `/api/v1/payment/{id}`

Retrieves complete payment information.

## Integration Notes
- **Polling:** Recommended to query the status endpoint every 30 seconds.
- **Expiration:** Payments expire automatically after 20 minutes.
- **Minimum Amount:** R$ 10.00.
