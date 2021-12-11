import React, { Component } from 'react';
import {
  Button,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
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
      jwttoken: this.props.jwt,
      loadingSpinner: false,
      buttonDisabled: true,
      deleteDisabled: false,
      dropdownOpen: false,
      validToSet: "Select",
      doUpdate: this.props.notedata.note ? true : false,
      noteToSet: this.props.notedata.note ? this.props.notedata.note : "",
      linkToSet: this.props.notedata.link ? this.props.notedata.link : "",
      currentTimestamp: new Date().toISOString()
    };
    
    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleLinkChange = this.handleLinkChange.bind(this);
    this.handleSubmitDelete = this.handleSubmitDelete.bind(this);
  }
  
  componentDidMount() {
    if (this.props.notedata.isvalid === true) {
      this.setState({
        validToSet: "Yes"
      });
    } else if (this.props.notedata.isvalid === false) {
      this.setState({
        validToSet: "No"
      });
    }
  }
  
  // Dropdown open/close toggler.
  toggleDropDown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }
  
  // Dropdown selector.
  handleClick(event) {
    this.setState({
      validToSet: event.currentTarget.textContent,
      buttonDisabled: false
    });
  }
  
  // Note text box input.
  handleNoteChange(event) {
    if (event.clipboardData) {
      this.setState({
        buttonDisabled: false,
        noteToSet: event.clipboardData.getData('Text')
      });
    } else {
      this.setState({
        buttonDisabled: false,
        noteToSet: event.target.value
      });
    }
  }
  
  // Link text box input.
  handleLinkChange(event) {
    if (event.clipboardData) {
      this.setState({
        buttonDisabled: false,
        linkToSet: event.clipboardData.getData('Text')
      });
    } else {
      this.setState({
        buttonDisabled: false,
        linkToSet: event.target.value
      });
    }
  }
  
  // Submits the post request to the backend. Uses the meta field to determine if update or insert.
  handleSubmit() {
    if ((this.state.noteToSet) && (this.state.validToSet !== "Select")) {
      this.setState({
        buttonDisabled: true,
        loadingSpinner: true
      });
      
      fetch(process.env.REACT_APP_FETCH_ENDPOINT.concat('/fetch/updatedivvynotes'), {
        method: 'POST',
        ContentType: 'application/json',
        headers: {
          'Authorization': this.state.jwttoken
        },
        body: JSON.stringify({
          "submitter": this.props.alias,
          "ticker": this.props.ticker,
          "isvalid": (this.state.validToSet === "Yes") ? true : false,
          "link": this.state.linkToSet,
          "note": this.state.noteToSet,
          "timestamp": this.state.currentTimestamp,
          "meta": this.state.doUpdate ? "update" : "insert"
        })
      }).then((response) => response.json()).then(responseJSON => {
        if ((responseJSON.update_successful === true) || (responseJSON.insert_successful === true)) {
          window.location.reload();
        } else {
          alert(responseJSON.message);
          this.setState({
            buttonDisabled: false,
            loadingSpinner: false
          });
        }
      }).catch(err => alert("Something went wrong contacting the server."));
    } else {
      alert("Is Valid and Note are required fields to submit.")
    }
  }
  
  // Delete-only method. Only requires the primary and sort key along with meta.
  handleSubmitDelete() {
    this.setState({
      deleteDisabled: true,
      loadingSpinner: true
    });
    
    fetch(process.env.REACT_APP_FETCH_ENDPOINT.concat('/fetch/updatedivvynotes'), {
      method: 'POST',
      ContentType: 'application/json',
      headers: {
        'Authorization': this.state.jwttoken
      },
      body: JSON.stringify({
        "submitter": this.props.alias,
        "ticker": this.props.ticker,
        "meta": "delete"
      })
    }).then((response) => response.json()).then(responseJSON => {
      if (responseJSON.delete_successful === true) {
        window.location.reload();
      } else {
        alert(responseJSON.message);
        this.setState({
          deleteDisabled: false,
          loadingSpinner: false
        });
      }
    }).catch(err => alert("Something went wrong contacting the server."));
  }
  
  // The form needs to have preventdefault set for onSubmit to ignore the built-in form enter key trigger.
  render() {
    return (
      <div>
        <Modal isOpen={this.props.showmodal} toggle={this.props.toggle} className={this.props.className}>
          <ModalHeader toggle={this.props.toggle}>Edit notes for {this.props.ticker}</ModalHeader>
          <ModalBody>
            <Form onSubmit={e => e.preventDefault()} className="form-horizontal">
              <FormGroup row>
                <Col md="6">
                  <Label htmlFor="text-input"><strong>Note</strong></Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="textarea" id="Note" name="Note" autoFocus={true} onChange={this.handleNoteChange} onPaste={this.handleNoteChange} value={this.state.noteToSet} style={{ height: 100 }} />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="6">
                  <Label htmlFor="text-input"><strong>Link</strong> (optional)</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="Link" name="Link" onChange={this.handleLinkChange} onPaste={this.handleLinkChange} value={this.state.linkToSet} />
                </Col>
              </FormGroup>
              <FormGroup row>
                <div>
                  <Col md="6">
                    <Label htmlFor="text-input"><strong>Arb Is Valid?</strong></Label>
                  </Col>
                </div>
                <div>
                  <Col xs="12" md="9">
                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
                      <DropdownToggle caret>
                        {this.state.validToSet}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={this.handleClick}>Yes</DropdownItem>
                        <DropdownItem onClick={this.handleClick}>No</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </Col>
                </div>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
          { this.state.loadingSpinner ?
            <div>
              <Spinner animation="border" role="status" variant="secondary" />
              <Button className="mr-1" type="submit" color="primary" disabled={true} >Submit</Button>
              <Button className="ml-1" color="secondary" onClick={this.props.toggle}>Cancel</Button>
            </div>
          :
            <div>
            { this.state.doUpdate ?
              <Button className="mr-5" color="danger" disabled={this.state.deleteDisabled} onClick={this.handleSubmitDelete}>Delete Note</Button>
            : null
            }
              <Button className="mr-1" type="submit" color="primary" disabled={this.state.buttonDisabled} onClick={this.handleSubmit} >Submit</Button>
              <Button className="ml-1" color="secondary" onClick={this.props.toggle}>Cancel</Button>
            </div>
          }
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Editor;