import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  ListGroup,
  ListGroupItem,
  Row
} from 'reactstrap';
import './Home.scss'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-12 natetrade-maincontent">
            <h1 className="display-4 mt-6 text-dark">Welcome to <em>NateTrade.</em></h1>
            <h2 className="mb-6 pb-6 pt-1 text-body">Uncommon market trading tools and data to help you find an edge.</h2>
          </div>
          <div className="col-12 natetrade-maincontent">
            <div className="animated fadeIn">
              <Row>
                <Col>
                  <Card className="bg-light">
                    <CardBody>
                      <CardTitle tag="h5">What's new?</CardTitle>
                      <CardTitle tag="h5">9/30/21 - Version 1.2.1</CardTitle>
                      <CardText>
                        <ListGroup>
                          <ListGroupItem className="border-0">- Moved to CDN to improve performance.</ListGroupItem>
                        </ListGroup>
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card className="bg-light">
                    <CardBody>
                      <CardTitle tag="h5">9/27/21 - Version 1.2.0</CardTitle>
                      <CardText>
                        <ListGroup>
                          <ListGroupItem className="border-0">- General bugfix.</ListGroupItem>
                          <ListGroupItem className="border-0">- Improved the divvy arb layout.</ListGroupItem>
                          <ListGroupItem className="border-0">- Added the ability to tag arbs with notes and included a voting feature.</ListGroupItem>
                          <ListGroupItem className="border-0">- Added a basic historical performance chart to give contextual relativeness.</ListGroupItem>
                        </ListGroup>
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card className="bg-light">
                    <CardBody>
                      <CardTitle tag="h5">9/15/21 - Version 1.1.1</CardTitle>
                      <CardText>
                        <ListGroup>
                          <ListGroupItem className="border-0">- Initial launch. </ListGroupItem>
                          <ListGroupItem className="border-0">- First strategy! Divvy arbs.</ListGroupItem>
                        </ListGroup>
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </React.Fragment>
  );
  }
}

export default withRouter(Home);
