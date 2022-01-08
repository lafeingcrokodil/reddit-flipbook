import { RequestHandler } from 'express';
import { URL } from 'url';

import * as env from '../env';
import Logger from '../logger';

const logger = Logger('flipbook:authorization');

const authorize: RequestHandler = (req, res, next) => {
  const cookie = req.cookies[env.get('COOKIE_NAME')];
  if (!cookie?.access || !cookie.refresh) {
    const authURL = new URL('https://www.reddit.com/api/v1/authorize');
    authURL.searchParams.append('client_id', env.get('REDDIT_CLIENT_ID'));
    authURL.searchParams.append('response_type', 'code');
    authURL.searchParams.append('state', req.url);
    authURL.searchParams.append('redirect_uri', env.get('REDDIT_REDIRECT_URI'));
    authURL.searchParams.append('duration', 'permanent');
    authURL.searchParams.append('scope', 'read');
    const err = {
      name: 'AuthorizationError',
      message: 'Authorization is needed to access the Reddit API'
    };
    logger.error(err);
    res.status(401);
    res.json({ authURL: authURL.toString(), error: err });
  } else {
    next();
  }
};

export = authorize;
