import express from 'express';

const router = express.Router();

import * as api from '../api';
import * as env from '../env';
import * as models from '../models';

router.get('/', async (req, res, next) => {
  try {
    const popularRes = await api.get(
      '/r/popular/hot',
      req.cookies[env.get('COOKIE_NAME')],
      { params: { limit: 1 } },
      api.registerNewTokens(res)
    );
    const id = popularRes.data.data.children[0].data.id;
    res.redirect(`/posts/${id}`);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const commentRes = await api.get(
      `/comments/${req.params.id}`,
      req.cookies[env.get('COOKIE_NAME')],
      { params: { depth: 2, limit: 10 } },
      api.registerNewTokens(res)
    );
    const post = await models.getFirstPost(commentRes.data[0]);
    res.json({ data: { post } });
  } catch (err) {
    next(err);
  }
});

router.get('/:name/next', async (req, res, next) => {
  try {
    const popularRes = await api.get(
      '/r/popular/hot',
      req.cookies[env.get('COOKIE_NAME')],
      { params: { after: req.params.name, limit: 1 } },
      api.registerNewTokens(res)
    );
    const id = popularRes.data.data.children[0].data.id;
    res.redirect(`/posts/${id}`);
  } catch (err) {
    next(err);
  }
});

export = router;
