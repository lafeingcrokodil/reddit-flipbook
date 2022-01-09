// For now, I've just duplicated the interface definitions from the server-side
// models directory. Ideally, however, these should be in a shared directory to
// ensure consistency and avoid duplication.

export interface Award {
  name: string;
  count: number;
  iconURL: string;
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

export interface Subreddit {
  name: string;
  iconURL: string;
}

export interface User {
  name: string;
  avatarURL: string;
}
