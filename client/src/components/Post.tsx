import moment from 'moment';
import React from 'react';

import './Post.css';
import Awards from './Awards';
import URL from './URL';
import * as models from '../models';
import { sanitize } from '../html';

function Post(props: { data: models.Post }) {
  const data = props.data;
  const age = moment.utc(data.timestamp).fromNow();
  return (
    <div>
      <div className='post-header'>
        <img alt='Subreddit icon' className='left round' src={data.subreddit.iconURL} />
        <div>r/{data.subreddit.name}</div>
        <div className='history'>
          Posted by u/{data.author.name} · {age}
        </div>
      </div>
      <Awards data={data.awards} />
      <h1>{data.title}</h1>
      {data.url && <URL url={data.url} contentType={data.contentType} />}
      <div dangerouslySetInnerHTML={{__html: sanitize(data.html)}}></div>
      <h2>{data.commentCount} Comments</h2>
    </div>
  );
}

export default Post;
