import { Award, getAwards } from './award';
import { Subreddit } from './subreddit';
import { Thing } from './thing';
import { User } from './user';

export interface Post {
  name: string;
  author: User;
  awards: Award[];
  commentCount: number;
  html?: string;
  subreddit: Subreddit;
  timestamp: Date;
  title: string;
  url?: string;
}

export function getFirstPost(listing: Thing): Post {
  if (typeof listing == 'string') {
    throw new Error(`Expected post listing, but got ${listing}`);
  }
  const firstThing = listing.data.children[0];
  if (typeof firstThing == 'string') {
    throw new Error(`Expected post, but got ${firstThing}`);
  }
  const data = firstThing.data;
  return {
    name: data.name,
    author: {
      name: data.author,
      avatarURL: 'https://picsum.photos/24'
    },
    awards: getAwards(data.all_awardings),
    commentCount: data.num_comments,
    html: data.selfText_html,
    subreddit: {
      name: data.subreddit,
      iconURL: 'https://picsum.photos/24'
    },
    timestamp: new Date(data.created_utc * 1000),
    title: data.title,
    url: data.is_self ? null : data.url
  };
}
