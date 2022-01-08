import React from 'react';

import favicon from '../icon.png';

function Dialog(props: { msg: string, title?: string }) {
  return (
    <div className='modal'>
      <div className='modal-msg'>
        <img className='modal-icon' src={String(favicon)} />
        {props.title && <p><b>{props.title}</b></p>}
        <p>{props.msg}</p>
      </div>
    </div>
  );
}

export default Dialog;
