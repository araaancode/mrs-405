// __tests__/payment.test.js
import { requestPayment, verifyPayment } from '@/lib/zarinpal';

describe('Payment Tests', () => {
    test('Request payment should return authority', async () => {
        const result = await requestPayment({
            amount: 10000,
            description: 'Test payment',
            email: 'test@example.com',
            mobile: '09123456789'
        });

        expect(result.success).toBe(true);
        expect(result.authority).toBeDefined();
    });

    test('Verify payment should validate authority', async () => {
        const result = await verifyPayment(10000, 'invalid-authority');
        expect(result.success).toBe(false);
    });
});