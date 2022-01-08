import axios from 'axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Response } from 'express';
import qs from 'qs';

import * as env from './env';
import Logger from './logger';

const logger = Logger('flipbook:api');

interface Tokens {
  access: string;
  refresh: string;
}

interface AuthCodeGrant {
  grant_type: string;
  code: string;
  redirect_uri: string;
}

interface RefreshTokenGrant {
  grant_type: string;
  refresh_token: string;
}

type Grant = AuthCodeGrant | RefreshTokenGrant;

export async function get(
  endpoint: string,
  tokens: Tokens,
  config: AxiosRequestConfig = {},
  registerNewTokens: (tokens: Tokens) => void
): Promise<AxiosResponse> {
  logger.log(`GET ${endpoint}`);
  config.headers = {
    Authorization: `Bearer ${tokens.access}`
  };
  try {
    return await axios.get(`https://oauth.reddit.com${endpoint}`, config);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status == 401) {
      const newTokens = await refreshTokens(tokens.refresh, registerNewTokens);
      return await get(endpoint, newTokens, config, registerNewTokens);
    }
    throw err;
  }
}

export async function getInitialTokens(authCode: string): Promise<Tokens> {
  return getTokens({
    grant_type: 'authorization_code',
    code: authCode,
    redirect_uri: env.get('REDDIT_REDIRECT_URI')
  });
}

async function refreshTokens(
  refreshToken: string,
  registerNewTokens: (tokens: Tokens) => void
): Promise<Tokens> {
  try {
    const newTokens = await getTokens({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    });
    registerNewTokens(newTokens);
    return newTokens;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status == 400) {
      throw {
        status: err.response.status,
        name: 'BadRequestError',
        message: 'Invalid refresh token'
      };
    }
    throw err;
  }
}

async function getTokens(grant: Grant): Promise<Tokens> {
  logger.log('GET /api/v1/access_token');
  const stringifiedParams = qs.stringify(grant);
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

export function registerNewTokens(res: Response) {
  return (tokens: Tokens) => {
    res.cookie(
      env.get('COOKIE_NAME'),
      tokens,
      { httpOnly: true, secure: true }
    );
  };
}
