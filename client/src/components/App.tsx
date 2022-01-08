import React from 'react';

import './App.css';
import * as models from '../models';
import Auth from './Auth';
import Dialog from './Dialog';
import NavBar from './NavBar';
import Post from './Post';

type APIError = { name: string, message: string, [key: string]: any };

class App extends React.Component {
  state: {
    error?: APIError;
    rawData?: any;
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
        this.setState({ rawData: json.data });
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
        this.setState({ rawData: json.data });
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
    if (this.state.rawData) {
      const post = models.getFirstPost(this.state.rawData[0]);
      return (
        <div>
          <NavBar onClick={() => this.handleNext(post.name)} />
          <div className='main'>
            <Post data={post} />
          </div>
        </div>
      );
    }
    const msg = 'It\'s taking a while to load the data, but it should appear shortly.';
    return <Dialog msg={msg} />;
  }
}

export default App;
