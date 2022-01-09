import React from 'react';

import Comment from './Comment';
import MoreComments from './MoreComments';
import * as models from '../models';

interface Props {
  data: models.Replies;
  onMoreClick: (id: string, commentIDs: string[]) => void;
}

function Replies(props: Props) {
  const html = props.data.map(reply => {
    switch (reply.kind) {
    case 'Comment': {
      return <Comment
        key={reply.id}
        data={reply as models.Comment}
        onMoreClick={props.onMoreClick}
      />;
      break;
    }
    case 'MoreComments': {
      const more = reply as models.MoreComments;
      if (!more.count) return null;
      return <MoreComments
        key={more.id}
        data={more}
        onMoreClick={props.onMoreClick}
      />;
      break;
    }
    }
  });
  return <div>{html}</div>;
}

export default Replies;
