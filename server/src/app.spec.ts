import dotenv from 'dotenv';
dotenv.config();

import { assert } from 'chai';
import 'mocha';
import request from 'supertest';

import app from './app';

describe('GET /', () => {
  it('responds successfully with HTML code', done => {
    request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });
});

describe('GET /nonsense', () => {
  it('responds with authorization error if cookie is missing', done => {
    request(app)
      .get('/nonsense')
      .expect('Content-Type', /json/)
      .expect(isAuthorizationError)
      .expect(401, done);
  });

  it('responds with authorization error if cookie is invalid', done => {
    request(app)
      .get('/nonsense')
      .set('Cookie', ['flipbook=nonsense'])
      .expect('Content-Type', /json/)
      .expect(isAuthorizationError)
      .expect(401, done);
  });

  it('redirects to / otherwise', done => {
    request(app)
      .get('/nonsense')
      .set('Cookie', ['flipbook=j:{"access":"foo","refresh":"bar"}'])
      .expect(res => {
        assert.deepEqual(res.text, 'Found. Redirecting to /');
      })
      .expect('Content-Type', /text/)
      .expect(302, done);
  });
});

function isAuthorizationError(res: request.Response) {
  assert.isObject(res.body);
  assert.hasAllKeys(res.body, ['authURL', 'error']);
  assert.isString(res.body.authURL);
  assert.match(res.body.authURL, /^http/);
  assert.isObject(res.body.error);
  assert.hasAllKeys(res.body.error, ['name', 'message']);
  assert.deepEqual(res.body.error.name, 'AuthorizationError');
}
