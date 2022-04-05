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
  
  componentDidMount() {
    document.title = process.env.REACT_APP_PAGE_TITLE;
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
                      <CardTitle tag="h5">4/5/22 - Version 1.3.2</CardTitle>
                      <CardText>
                        <ListGroup>
                          <ListGroupItem className="border-0">- Deployed new volatility strategy: Options term structure backwardation screener.</ListGroupItem>
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
                      <CardTitle tag="h5">11/27/21 - Version 1.3.1</CardTitle>
                      <CardText>
                        <ListGroup>
                          <ListGroupItem className="border-0">- Deployed SLB history chart for borrow arb securities that indicate lending trend.</ListGroupItem>
                          <ListGroupItem className="border-0">- Improved divvy arb and borrow arb scanner resolution to 5 minutes.</ListGroupItem>
                          <ListGroupItem className="border-0">- Built exciting new architecture that will allow for high-frequency trading strategies.</ListGroupItem>
                        </ListGroup>
                      </CardText>
                    </CardBody>
                    <CardBody>
                      <CardTitle tag="h5">10/30/21 - Version 1.3.0</CardTitle>
                      <CardText>
                        <ListGroup>
                          <ListGroupItem className="border-0">- Deployed borrow arbitrage strategy. Current in beta testing.</ListGroupItem>
                          <ListGroupItem className="border-0">- Several bugfixes to divvy arb backend for better error handling.</ListGroupItem>
                        </ListGroup>
                      </CardText>
                    </CardBody>
                    <CardBody>
                      <CardTitle tag="h5">10/8/21 - Version 1.2.3</CardTitle>
                      <CardText>
                        <ListGroup>
                          <ListGroupItem className="border-0">- Localized timestamps to the user's timezone.</ListGroupItem>
                          <ListGroupItem className="border-0">- Added a reset password and forgot password page.</ListGroupItem>
                          <ListGroupItem className="border-0">- Added an about page with contact form.</ListGroupItem>
                          <ListGroupItem className="border-0">- Fixed login bug to work with password managers.</ListGroupItem>
                          <ListGroupItem className="border-0">- Updated menu organization to prepare for future pages.</ListGroupItem>
                        </ListGroup>
                      </CardText>
                      <CardTitle tag="h5">10/1/21 - Version 1.2.2</CardTitle>
                      <CardText>
                        <ListGroup>
                          <ListGroupItem className="border-0">- Added a help section to divvy arbs.</ListGroupItem>
                        </ListGroup>
                      </CardText>
                      <CardTitle tag="h5">9/30/21 - Version 1.2.1</CardTitle>
                      <CardText>
                        <ListGroup>
                          <ListGroupItem className="border-0">- Moved to CDN to improve performance.</ListGroupItem>
                        </ListGroup>
                      </CardText>
                    </CardBody>
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
