import axios from 'axios';

import { Award, getAwards } from './award';
import { Subreddit } from './subreddit';
import { Thing } from './thing';
import { User } from './user';

export interface Post {
  name: string;
  author: User;
  awards: Award[];
  commentCount: number;
  contentType?: string;
  html?: string;
  subreddit: Subreddit;
  timestamp: Date;
  title: string;
  url?: string;
}

export async function getFirstPost(listing: Thing): Promise<Post> {
  if (typeof listing == 'string') {
    throw new Error(`Expected post listing, but got ${listing}`);
  }
  const firstThing = listing.data.children[0];
  if (typeof firstThing == 'string') {
    throw new Error(`Expected post, but got ${firstThing}`);
  }
  const data = firstThing.data;
  const url = data.is_self ? null : data.url;
  const contentType = await getContentType(url);
  return {
    name: data.name,
    author: {
      name: data.author,
      avatarURL: 'https://picsum.photos/24'
    },
    awards: getAwards(data.all_awardings),
    commentCount: data.num_comments,
    contentType: contentType,
    html: data.selfText_html,
    subreddit: {
      name: data.subreddit,
      iconURL: 'https://picsum.photos/24'
    },
    timestamp: new Date(data.created_utc * 1000),
    title: data.title,
    url: url
  };
}

async function getContentType(url: string): Promise<string | undefined> {
  let contentType: string | undefined;
  if (url) {
    const res = await axios.head(url);
    contentType = res.headers['content-type'];
  }
  return contentType;
}
