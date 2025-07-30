import rateLimit from 'express-rate-limit';

const limit = rateLimit({
    limit: 100,
    windowMs: 15 * 60 * 1000,
    message: 'Too many requests. Try again later.',
    statusCode: 429,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
});

export default limit;
