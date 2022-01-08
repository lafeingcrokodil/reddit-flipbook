import React from 'react';

function Auth(props: { authURL: string }) {
  return (
    <div className='modal'>
      <div className='modal-msg'>
        <p>Please follow the link below to allow this app to access the Reddit API on your behalf.</p>
        <a className='button' href={props.authURL}>Authorize</a>
      </div>
    </div>
  );
}

export default Auth;
