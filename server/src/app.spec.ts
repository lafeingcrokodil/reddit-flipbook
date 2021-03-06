import dotenv from 'dotenv';
dotenv.config();

import { assert } from 'chai';
import 'mocha';
import request from 'supertest';

import app from './app';

// Note that several of the tests are pending, because I haven't yet figured
// out a good way to automatically get up-to-date and valid authorization
// codes, access tokens and refresh tokens, and I'm not sure how else to
// meaningfully test the routes.

describe('GET /', () => {
  it('responds successfully with HTML code', done => {
    request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });
});

describe('GET /nonsense', () => {
  it('redirects to / if valid cookie is set', done => {
    request(app)
      .get('/nonsense')
      .set('Cookie', ['flipbook=j:{"access":"foo","refresh":"bar"}'])
      .expect('Content-Type', /text/)
      .expect(res => {
        assert.deepEqual(res.text, 'Found. Redirecting to /');
      })
      .expect(302, done);
  });
});

describe('GET /posts', () => {
  it('responds with unauthorized error if cookie is missing', done => {
    request(app)
      .get('/posts')
      .expect('Content-Type', /json/)
      .expect(isUnauthorizedError)
      .expect(401, done);
  });

  it('responds with unauthorized error if cookie is invalid', done => {
    request(app)
      .get('/posts')
      .set('Cookie', ['flipbook=nonsense'])
      .expect('Content-Type', /json/)
      .expect(isUnauthorizedError)
      .expect(401, done);
  });

  it('responds with bad request error if refresh token is invalid', done => {
    const expectedBody = {
      error: {
        status: 400,
        name: 'BadRequestError',
        message: 'Invalid refresh token'
      }
    };
    request(app)
      .get('/posts')
      .set('Cookie', ['flipbook=j:{"access":"foo","refresh":"bar"}'])
      .expect('Content-Type', /json/)
      .expect(400, expectedBody, done);
  });

  it('responds successfully with data object if cookie is set');
});

describe('GET /posts/:id', () => {
  it('responds successfully with data object if cookie is set');
});

describe('GET /posts/:name/morecomments', () => {
  it('responds successfully with data object if cookie is set');
});

describe('GET /posts/:name/next', () => {
  it('redirects to some /post/:id if cookie is set');
});

describe('GET /redirect', () => {
  it('responds with bad request error if query parameter is missing', done => {
    const expectedBody = {
      error: {
        status: 400,
        name: 'BadRequestError',
        message: 'Missing or invalid query parameter "code"'
      }
    };
    request(app)
      .get('/redirect')
      .expect('Content-Type', /json/)
      .expect(400, expectedBody, done);
  });

  it('responds with unauthorized error if code is invalid', done => {
    const expectedBody = {
      error: {
        status: 401,
        name: 'UnauthorizedError',
        message: 'invalid_grant'
      }
    };
    request(app)
      .get('/redirect')
      .query({ code: 'nonsense' })
      .expect('Content-Type', /json/)
      .expect(401, expectedBody, done);
  });

  it('sets cookie and redirects to / otherwise');
});

function isUnauthorizedError(res: request.Response) {
  assert.isObject(res.body);
  assert.hasAllKeys(res.body, ['error']);
  assert.isObject(res.body.error);
  assert.hasAllKeys(res.body.error, ['status', 'name', 'message', 'authURL']);
  assert.deepEqual(res.body.error.name, 'UnauthorizedError');
  assert.isString(res.body.error.authURL);
  assert.match(res.body.error.authURL, /^http/);
}
