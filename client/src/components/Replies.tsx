import React from 'react';

import Comment from './Comment';
import MoreComments from './MoreComments';
import * as models from '../models';

interface Props {
  data: models.Replies;
  onMoreClick: (parentName: string, commentIDs: string[]) => void;
}

class Replies extends React.Component<Props> {
  state: Props;

  constructor(props: Props) {
    super(props);
    this.state = props;
  }

  render() {
    const html = this.state.data.map(reply => {
      switch (reply.kind) {
      case 'Comment': {
        return <Comment
          key={reply.id}
          data={reply as models.Comment}
          onMoreClick={this.props.onMoreClick}
        />;
        break;
      }
      case 'MoreComments': {
        const more = reply as models.MoreComments;
        if (!more.count) return null;
        return <MoreComments
          key={more.id}
          data={more}
          onMoreClick={this.props.onMoreClick}
        />;
        break;
      }
      }
    });
    return <div>{html}</div>;
  }
}

export default Replies;
