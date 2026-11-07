# Relationship Consciousness — 1:1 Consultancy Website

A responsive React + Vite website with a consultancy form, phone OTP verification flow, and Razorpay checkout integration.

## Run in VS Code

1. Install **Node.js 18 or newer**.
2. Extract this ZIP and open the extracted folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Run:

   ```bash
   npm install
   ```

5. Copy `.env.example` to `.env`.
6. Start the website:

   ```bash
   npm run dev
   ```

7. Open `http://localhost:5173`.

## Demo OTP

Until a real SMS provider is configured, the development server uses **123456** as the OTP. This is for local testing only. It does not send an SMS.

## Configure Razorpay test payments

1. Create or sign in to a Razorpay account and enable Test Mode.
2. Get your Test Key ID and Key Secret from the Razorpay dashboard.
3. Add them to `.env`:

   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
   RAZORPAY_KEY_SECRET=your_test_secret
   ```

4. Restart `npm run dev`. Use Razorpay's test payment details from its official documentation/dashboard.

The fee is currently **₹999** in `src/App.jsx` and the API validates an order for ₹999. Update both places if you change the consultation fee.

## Important before publishing

This is a starter project, not a production-ready booking platform.

- The demo OTP is not a real SMS verification service. Integrate Twilio or another SMS provider in `server/index.js` before launch.
- Configure real Razorpay keys only on the server. Never put the secret key in React/Vite frontend code.
- Add a database to store consultation requests, payment IDs and booking status.
- Add email/SMS booking confirmations, privacy policy, terms, refund/cancellation policy and a support contact.
- Use HTTPS and deploy the frontend and backend with secure environment variables.
- The current server keeps OTP/verified-phone state in memory, so it resets when the server restarts. Use a persistent store such as Redis for production.
- Do not collect sensitive relationship histories in this basic form. If you later add them, explain how that data is stored and protected.

## Main files

- `src/App.jsx` — page content, form, OTP flow and checkout
- `src/styles.css` — responsive styling
- `server/index.js` — OTP endpoints, Razorpay order creation and payment signature verification
- `.env.example` — environment variable template
