import React from 'react';

import './App.css';
import * as models from '../models';
import Auth from './Auth';
import Dialog from './Dialog';
import NavBar from './NavBar';
import Post from './Post';
import Replies from './Replies';

interface AppData {
  post: models.Post;
  replies: models.Replies;
}

interface AppError {
  name: string,
  message: string,
  [key: string]: any
}

class App extends React.Component {
  state: {
    error?: AppError;
    data?: AppData;
  };

  constructor(props: never) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    try {
      const res = await fetch('/posts');
      const json = await res.json();
      if (json.error) {
        throw json.error;
      } else if (json.data) {
        this.setState({ data: json.data });
      }
    } catch (err) {
      this.setState({ error: err });
    }
  }

  async handleMoreClick(id: string, commentIDs: string[]) {
    try {
      if (!this.state.data) {
        throw new Error('Unexpectedly missing post and comment data');
      }
      const requestedCommentIDs = commentIDs.slice(0, 10);
      const params = {
        children: requestedCommentIDs.join(',')
      };
      const queryString = new URLSearchParams(params).toString();
      const url = `/posts/${this.state.data.post.name}/morecomments?${queryString}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.error) {
        throw json.error;
      } else if (json.data) {
        const newData: AppData = {
          post: this.state.data.post,
          replies: this.insertMoreComments(this.state.data.replies, id, requestedCommentIDs, json.data)
        };
        this.setState({ data: newData });
      }
    } catch (err) {
      this.setState({ error: err });
    }
  }

  insertMoreComments(
    replies: models.Replies,
    id: string,
    requestedCommentIDs: string[],
    moreComments: models.Replies
  ): models.Replies {
    const result: models.Replies = [];
    for (const reply of replies) {
      if (reply.kind == 'MoreComments' && reply.id == id) {
        result.push(...moreComments);
        const newReply = { ...reply };
        newReply.count -= requestedCommentIDs.length;
        newReply.ids = [];
        idLoop:
        for (const id of reply.ids) {
          for (const requestedID of requestedCommentIDs) {
            if (id == requestedID) {
              continue idLoop;
            }
          }
          newReply.ids.push(id);
        }
        if (!newReply.count || !newReply.ids.length) {
          continue;
        }
        result.push(newReply);
      } else if (reply.kind == 'Comment') {
        const newReply = { ...reply };
        newReply.replies = this.insertMoreComments(reply.replies, id, requestedCommentIDs, moreComments);
        result.push(newReply);
      } else {
        result.push(reply);
      }
    }
    return result;
  }

  async handleNext(postName: string) {
    try {
      const url = `/posts/${postName}/next`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.error) {
        throw json.error;
      } else if (json.data) {
        this.setState({ data: json.data });
      }
    } catch (err) {
      this.setState({ error: err });
    }
  }

  render() {
    if (this.state.error) {
      if (this.state.error.name == 'UnauthorizedError' && this.state.error.authURL) {
        return <Auth authURL={this.state.error.authURL} />;
      }
      return <Dialog title={this.state.error.name} msg={this.state.error.message} />;
    }
    if (this.state.data) {
      const { post, replies } = this.state.data;
      return (
        <div>
          <NavBar onClick={() => this.handleNext(post.name)} />
          <div className='main'>
            <Post data={post} />
            <Replies data={replies} onMoreClick={this.handleMoreClick.bind(this)} />
          </div>
        </div>
      );
    }
    const msg = 'It\'s taking a while to load the data, but it should appear shortly.';
    return <Dialog msg={msg} />;
  }
}

export default App;
