import 'mocha';
import request from 'supertest';

import app from './app';

testEndpoint('/', 200, /html/, {});
testEndpoint('/nonsense', 404, /json/, {
  error: {
    name: 'NotFoundError',
    message: 'Not Found'
  }
});

function testEndpoint(
  endpoint: string,
  expectedStatus: number,
  expectedContentType: RegExp,
  expectedBody: { data?: any, error?: any }
) {
  describe(`GET ${endpoint}`, () => {
    it('responds with expected status, content type and body', done => {
      request(app)
        .get(endpoint)
        .expect('Content-Type', expectedContentType)
        .expect(expectedStatus, expectedBody, done);
    });
  });
}
