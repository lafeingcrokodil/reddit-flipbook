import express from 'express';

import * as api from '../api';

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
    const tokens = await api.getInitialTokens(req.query.code);
    api.registerNewTokens(res)(tokens);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

export = router;
