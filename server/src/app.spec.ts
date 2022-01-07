import 'mocha';
import request from 'supertest';

import app from './app';

testEndpoint('/', 200, { data: 'index' });
testEndpoint('/nonsense', 404, {
  error: {
    name: 'NotFoundError',
    message: 'Not Found'
  }
});

function testEndpoint(
  endpoint: string,
  expectedStatus: number,
  expectedBody: { data?: any, error?: any }
) {
  describe(`GET ${endpoint}`, () => {
    it('responds with expected status and body', done => {
      request(app)
        .get(endpoint)
        .expect(expectedStatus, expectedBody, done);
    });
  });
}
