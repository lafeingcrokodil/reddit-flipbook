import React from 'react';

import './MoreComments.css';
import * as models from '../models';

interface Props {
  data: models.MoreComments;
  onMoreClick: (parentName: string, commentIDs: string[]) => void;
}

function MoreComments(props: Props) {
  return (
    <span
      key={props.data.id}
      className='link more-comments'
      onClick={() => props.onMoreClick(props.data.parentName, props.data.ids)}
    >
      {props.data.count} more replies
    </span>
  );
}

export default MoreComments;
