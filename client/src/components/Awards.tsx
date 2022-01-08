import React from 'react';

import './Awards.css';
import * as models from '../models';

function Awards(props: { data: models.Award[] }) {
  const awardHTML = props.data.map(award =>
    <span className='award' key={award.name}>
      <img alt={award.name} src={award.iconURL} />
      <span>{award.count}</span>
    </span>
  );
  return <div className='awards'>{awardHTML}</div>;
}

export default Awards;
