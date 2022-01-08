import React from 'react';

import './NavBar.css';

function NavBar(props: { onClick: () => void }) {
  return (
    <div className='nav highlight'>
      <div className='nav-right'>
        <span className='link' onClick={props.onClick}>Next ▸</span>
      </div>
    </div>
  );
}

export default NavBar;
