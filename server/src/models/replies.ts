import { Award, getAwards } from './award';
import { Thing } from './thing';
import { User } from './user';

export type Replies = (Comment | MoreComments)[];

export interface Comment {
  kind: string;
  id: string;
  author: User;
  awards: Award[];
  html: string;
  postName: string;
  replies: Replies;
  timestamp: Date;
}

export interface MoreComments {
  kind: string;
  id: string;
  ids: string[];
  count: number;
  parentName: string;
}

export function getInitialReplies(thing: Thing): Replies {
  // thing can be an empty string, e.g. if there are no replies
  if (!thing) {
    return [];
  }
  if (typeof thing == 'string') {
    throw new Error(`Expected comment listing; got ${thing}`);
  }
  return getReplies(thing.data.children);
}

export function getReplies(things: Thing[]): Replies {
  const replies = [] as Replies;
  for (const thing of things) {
    if (typeof thing == 'string') {
      throw new Error(`Expected comment or more; got ${thing}`);
    }
    switch (thing.kind) {
    case 't1': {
      replies.push(getComment(thing));
      break;
    }
    case 'more': {
      replies.push(getMoreComments(thing));
      break;
    }
    default: {
      throw new Error(`Unexpected kind: ${thing.kind}`);
    }
    }
  }
  return replies;
}

function getComment(thing: Thing): Comment {
  if (typeof thing == 'string') {
    throw new Error(`Expected comment; got ${thing}`);
  }
  return {
    kind: 'Comment',
    id: thing.data.id,
    author: {
      name: thing.data.author,
      avatarURL: 'https://picsum.photos/24'
    },
    awards: getAwards(thing.data.all_awardings),
    html: thing.data.body_html,
    postName: thing.data.link_id,
    replies: getInitialReplies(thing.data.replies),
    timestamp: new Date(thing.data.created_utc * 1000)
  };
}

function getMoreComments(thing: Thing): MoreComments {
  if (typeof thing == 'string') {
    throw new Error(`Expected more; got ${thing}`);
  }
  return {
    kind: 'MoreComments',
    id: thing.data.id,
    ids: thing.data.children as string[],
    count: thing.data.count,
    parentName: thing.data.parent_id
  };
}
