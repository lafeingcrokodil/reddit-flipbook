import React from 'react';

import './App.css';
import * as models from '../models';
import Auth from './Auth';
import Dialog from './Dialog';
import NavBar from './NavBar';
import Post from './Post';
import Replies from './Replies';

type AppError = { name: string, message: string, [key: string]: any };

class App extends React.Component {
  state: {
    error?: AppError;
    data?: {
      post: models.Post;
      replies: models.Replies;
    };
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

  async handleMoreClick(parentName: string, commentIDs: string[]) {
    try {
      if (!this.state.data) {
        throw new Error('Unexpectedly missing post and comment data');
      }
      const params = {
        children: commentIDs.slice(0, 10).join(',')
      };
      const queryString = new URLSearchParams(params).toString();
      const url = `/posts/${this.state.data.post.name}/morecomments?${queryString}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.error) {
        throw json.error;
      } else if (json.data) {
        console.log(parentName, json.data);
      }
    } catch (err) {
      this.setState({ error: err });
    }
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
