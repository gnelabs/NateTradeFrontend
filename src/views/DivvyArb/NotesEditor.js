import React, { Component } from 'react';
import {
  Button,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner
} from 'reactstrap';


class Editor extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      jwttoken: "",
      loadingSpinner: true
    };
  }
  
  componentDidMount() {
    console.log("loaded notes editor component");
    console.log(this.props);
  }
  
  render() {
    return (
      <div>
        <Modal isOpen={this.props.showmodal} toggle={this.props.toggle} className={this.props.className}>
          <ModalHeader toggle={this.props.toggle}>Edit notes for {this.props.ticker}</ModalHeader>
          <ModalBody>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </ModalBody>
          <ModalFooter>
            <Button color="primary">Do Something</Button>{' '}
            <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Editor;