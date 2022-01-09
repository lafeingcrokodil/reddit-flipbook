// For now, I've just duplicated the interface definitions from the server-side
// models directory. Ideally, however, these should be in a shared directory to
// ensure consistency and avoid duplication.

export interface Award {
  name: string;
  count: number;
  iconURL: string;
}

export interface Comment {
  kind: 'Comment';
  id: string;
  author: User;
  awards: Award[];
  html: string;
  postName: string;
  replies: Replies;
  timestamp: Date;
}

export interface MoreComments {
  kind: 'MoreComments';
  id: string;
  ids: string[];
  count: number;
}

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

export type Replies = (Comment | MoreComments)[];

export interface Subreddit {
  name: string;
  iconURL: string;
}

export interface User {
  name: string;
  avatarURL: string;
}
