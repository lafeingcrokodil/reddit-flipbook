import React from 'react';

import './Image.css';

class Image extends React.Component<{ url: string }> {
  state: { isModalVisible: boolean };

  constructor(props: { url: string }) {
    super(props);
    this.state = { isModalVisible: false };
  }

  handleClose() {
    this.setState({ isModalVisible: false });
  }

  handleImgClick() {
    this.setState({ isModalVisible: true });
  }

  render() {
    let modalClassName = 'modal';
    if (!this.state.isModalVisible) {
      modalClassName += ' hidden';
    }
    return (
      <div>
        <img alt='Preview' className='preview-img' src={this.props.url} onClick={this.handleImgClick.bind(this)} />
        <div className={modalClassName}>
          <span className='close link' onClick={this.handleClose.bind(this)}>&times;</span>
          <img alt='Zoomed-in' className='modal-content' src={this.props.url} />
        </div>
      </div>
    );
  }
}

export default Image;
