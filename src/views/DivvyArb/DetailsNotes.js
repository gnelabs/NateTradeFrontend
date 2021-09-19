import React, { Component } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Row
} from 'reactstrap';


class Notes extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className="animated fadeIn">
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
                      <Button className="mr-1 float-right">Edit Note</Button>
                    </p>
                  :
                    <p>
                      <strong>{ value.submitter }</strong> says:<i className="ml-2 fa fa-thumbs-o-down"></i>
                      <Button className="mr-1 float-right">Edit Note</Button>
                    </p>
                  }
                  </CardTitle>
                  <CardText>
                  <p>{ value.note }</p>
                  { value.link ?
                    <p><a href={ value.link } target="_blank">{ value.link }</a></p>
                  : null
                  }
                  </CardText>
                </CardBody>
              </Card>
            </Col>
          </Row>
          ))}
        </div>
      :
        <small className="text-muted">There are no notes to display for this ticker.</small>
      }
      </div>
    );
  }
}

export default Notes;