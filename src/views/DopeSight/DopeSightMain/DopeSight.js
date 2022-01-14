import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, CardBody, Col, Row } from 'reactstrap';

class DopeSight extends Component {
  componentDidMount() {
    document.title = process.env.REACT_APP_PAGE_TITLE.concat(' - In Development');
  }
  
  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-12 natetrade-maincontent">
            <h1 className="display-4 mt-6 text-dark">In development.</h1>
            <h3 className="mb-6 pb-6 pt-1 text-body">This feature is in development. Stay tuned for future releases.</h3>
            <p />
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <i className="fa fa-info-circle"></i>&nbsp;
                    DOPE Sight is a new service in development which stands for Dealer Options Positioning Estimate. 
                    The goal is to estimate, with a high degree of accuracy, the real-time net delta position on an 
                    option market maker's hedging book. This is a high-frequency trading strategy which attempts 
                    to capitalize on short term imbalances in liquidity between the options market and the equity 
                    market. DOPE Sight uses proprietary cutting-edge technology to scan the entire U.S. lit options 
                    market, and within a fraction of a second determine the optimal securities for short term 
                    trading alpha. Trust me, it's gonna be DOPE!
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </React.Fragment>
  );
  }
}

export default withRouter(DopeSight);
