import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Spinner 
} from 'reactstrap';
import { Auth } from 'aws-amplify';


class AccountManage extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      jwttoken: "",
      alias: "",
      timezone: ""
    };
  }
  
  getJwtOrRedirect() {
    // Get jwt or redirect to login if missing.
    Auth.currentAuthenticatedUser()
      .then(result => {
        this.setState({
          jwttoken: (result.signInUserSession.accessToken.jwtToken),
        });
      })
      .catch(err => { 
        this.props.history.push({
          pathname: '/login'
        });
      });
  }
  
  componentDidMount() {
    this.getJwtOrRedirect()
  }
  
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-sort-amount-desc"></i> ASDF
              </CardHeader>
              <CardBody>
                test asdf
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(AccountManage);
