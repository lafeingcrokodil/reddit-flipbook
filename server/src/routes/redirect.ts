import express from 'express';

import * as api from '../api';
import * as env from '../env';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    if (typeof req.query.code != 'string') {
      throw {
        status: 400,
        name: 'BadRequestError',
        message: 'Missing or invalid query parameter "code"'
      };
    }
    const tokens = await api.getTokens(req.query.code);
    res.cookie(
      env.get('COOKIE_NAME'),
      tokens,
      { httpOnly: true, secure: true }
    );
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

export = router;
