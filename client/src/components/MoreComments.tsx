import React from 'react';

import './MoreComments.css';
import * as models from '../models';

function MoreComments(props: { data: models.MoreComments }) {
  return (
    <span
      key={props.data.id}
      className='more-comments'
    >
      {props.data.count} more replies
    </span>
  );
}

export default MoreComments;
