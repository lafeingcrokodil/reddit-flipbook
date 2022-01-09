import moment from 'moment';
import React from 'react';

import './Comment.css';
import Awards from './Awards';
import Replies from './Replies';
import * as models from '../models';
import { sanitize, strip } from '../html';

interface Props {
  data: models.Comment;
  onMoreClick: (parentName: string, commentIDs: string[]) => void;
}

class Comment extends React.Component<Props> {
  state: { isCollapsed: false };

  constructor(props: Props) {
    super(props);
    this.state = { isCollapsed: false };
  }

  handleCollapse(e: React.MouseEvent) {
    if (e.target !== e.currentTarget) return;
    this.setState({ isCollapsed: true });
  }

  handleExpand() {
    this.setState({ isCollapsed: false });
  }

  render() {
    const data = this.props.data;
    const author = <span className='comment-author'>{data.author.name}</span>;
    const age = moment.utc(data.timestamp).fromNow();
    const sanitizedHTML = sanitize(data.html);
    const plainBody = strip(sanitizedHTML);
    if (this.state.isCollapsed) {
      return (
        <div key={data.id} className='comment compact' onClick={this.handleExpand.bind(this)}>
          <div>
            <img alt='Avatar' className='round' src={data.author.avatarURL} />
            <span className='history'>{author} · {age} · {plainBody}</span>
          </div>
        </div>
      );
    }
    return (
      <div key={data.id} className='comment' onClick={(e) => this.handleCollapse(e)}>
        <div className='comment-source'>
          <img alt='Avatar' className='round' src={data.author.avatarURL} />
          <span className='history'>{author} · {age}</span>
        </div>
        <div className='comment-content'>
          {data.awards.length > 0 && <Awards data={data.awards}/>}
          <div dangerouslySetInnerHTML={{__html: sanitize(data.html)}}></div>
          <Replies data={data.replies} onMoreClick={this.props.onMoreClick} />
        </div>
      </div>
    );
  }
}

export default Comment;
