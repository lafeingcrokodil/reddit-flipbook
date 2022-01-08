import axios from 'axios';
import qs from 'qs';

import * as env from './env';

export interface Tokens {
  access: string;
  refresh: string;
}

export async function getTokens(authorizationCode: string): Promise<Tokens> {
  const tokenParams = {
    grant_type: 'authorization_code',
    code: authorizationCode,
    redirect_uri: process.env.REDDIT_REDIRECT_URI
  };
  const stringifiedParams = qs.stringify(tokenParams);
  const res = await axios.post(
    'https://www.reddit.com/api/v1/access_token',
    stringifiedParams,
    {
      auth: {
        username: env.get('REDDIT_CLIENT_ID'),
        password: env.get('REDDIT_CLIENT_SECRET')
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  if (res.data.error) {
    throw {
      status: 401,
      name: 'UnauthorizedError',
      message: res.data.error
    };
  }
  return {
    access: res.data.access_token,
    refresh: res.data.refresh_token
  };
}
