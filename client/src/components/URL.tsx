import React from 'react';

import Image from './Image';

function URL(props: { url: string, contentType: string | undefined }) {
  if (props.contentType && /image/.test(props.contentType)) {
    return <Image url={props.url} />;
  }
  return <a href={props.url}>{props.url}</a>;
}

export default URL;
