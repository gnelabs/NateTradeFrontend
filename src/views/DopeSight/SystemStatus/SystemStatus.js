import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import Iframe from 'react-iframe'


class SystemStatus extends Component {
  componentDidMount() {
    document.title = process.env.REACT_APP_PAGE_TITLE.concat(' - In Development');
  }
  
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-thermometer-three-quarters"></i> DOPE Sight System Status
              </CardHeader>
              <CardBody>
                <Iframe url="https://cloudwatch.amazonaws.com/dashboard.html?dashboard=DopeSight&context=eyJSIjoidXMtZWFzdC0xIiwiRCI6ImN3LWRiLTkxOTc2ODYxNjc4NiIsIlUiOiJ1cy1lYXN0LTFfSU1YSWZpZkhnIiwiQyI6IjEzanY2bG9kMDhvNnBlaDNlcnNqZmxlaXZ0IiwiSSI6InVzLWVhc3QtMToxMWMzOWYxMy1mYTM3LTRhYTYtYWI1ZC1kNzAzYjdhNmI0OTgiLCJNIjoiUHVibGljIn0="
                  width="100%"
                  height="700px"
                  id="systemStatusDashboard"
                  className="systemStatusDashboard"
                  display="initial"
                  position="relative"
                >
                </Iframe>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(SystemStatus);
