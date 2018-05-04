'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://sjchamblee:priscilla@ds263619.mlab.com:63619/blogtopic';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://sjchamblee:priscilla@ds263639.mlab.com:63639/blogtopic-test';
exports.PORT = process.env.PORT || 1234;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';