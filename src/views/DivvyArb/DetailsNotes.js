import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Row
} from 'reactstrap';
import Editor from './NotesEditor';


class Notes extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      showModal: false,
      editableNote: {}
    };
    
    this.handleEdit = this.handleEdit.bind(this);
  }
  
  handleEdit() {
    this.setState({
      showModal: !this.state.showModal,
    });
  }
  
  // Make the user's own note editable, prepare to pass that data to the Editor component.
  freshEditableNote() {
    if (this.props.notedata) {
      for (let item of this.props.notedata) {
        if (item.submitter === this.props.alias) {
          this.setState({
            editableNote: item
          });
        }
      }
    }
  }
  
  // Clear out previously cached note data by resetting the state.
  componentDidUpdate(previousProps, previousState) {
    if (previousProps.notedata !== this.props.notedata) {
      this.setState({
        editableNote: {}
      }, this.freshEditableNote);
    }
  }
  
  render() {
    return (
      <div className="animated fadeIn">
      { this.state.showModal ?
        <Editor
          ticker={this.props.ticker}
          showmodal={this.state.showModal}
          toggle={this.handleEdit}
          jwt={this.props.jwt}
          alias={this.props.alias}
          notedata={this.state.editableNote}
        />
      : null
      }
      { this.props.notedata ?
        <div>
        { this.props.notedata.map((value, index) => (
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <CardTitle tag="h5">
                  { value.isvalid ?
                    <p>
                      <strong>{ value.submitter }</strong> says:<i className="ml-2 fa fa-thumbs-o-up"></i>
                      { (value.submitter === this.props.alias) ?
                        <Button className="mr-1 float-right" onClick={this.handleEdit}>Edit Note</Button>
                      : null
                      }
                    </p>
                  :
                    <p>
                      <strong>{ value.submitter }</strong> says:<i className="ml-2 fa fa-thumbs-o-down"></i>
                      { (value.submitter === this.props.alias) ?
                        <Button className="mr-1 float-right" onClick={this.handleEdit}>Edit Note</Button>
                      : null
                      }
                    </p>
                  }
                  </CardTitle>
                  <CardText>
                  <p>{ value.note }</p>
                  { value.link ?
                    <p><a href={ value.link } target="_blank">{ value.link }</a></p>
                  : null
                  }
                  <p><small>{ value.timestamp }</small></p>
                  </CardText>
                </CardBody>
              </Card>
            </Col>
          </Row>
          ))
        }
        </div>
      : null
      }
      { (this.props.ticker !==  "Click View for details.")  ?
        <div>
        { (Object.keys(this.state.editableNote).length === 0) ?
          <Row>
            <Col>
              <Button className="ml-2" onClick={this.handleEdit}>Add Note</Button>
            </Col>
          </Row>
        : null
        }
        </div>
      :
        <Row>
          <Col>
            <small className="text-muted">There are no notes to display for this ticker.</small>
          </Col>
        </Row>
      }
      </div>
    );
  }
}

export default Notes;