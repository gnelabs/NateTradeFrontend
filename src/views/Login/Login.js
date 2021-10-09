import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Spinner } from 'reactstrap';
import { Auth } from 'aws-amplify';


class Login extends Component {
  constructor(props) {
    super(props);
    
    
    // The state is passed from register to login if this is a new user.
    if (this.props.location.state !== undefined && this.props.location.state != null) {
      this.state = {
        freshlyRegistered: this.props.location.state,
      };
    } else {
      this.state = {
        freshlyRegistered: "",
      };
    }
    
    this.state = {
      submitDisabled: true,
      verifyDisabled: true,
      userName: this.state.freshlyRegistered,
      loading_cognito: false,
      jwttoken: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleVerify = this.handleVerify.bind(this);
    this.handleForgotpassword = this.handleForgotpassword.bind(this);
  }
  
  handleKeyPress(target) {
    if(target.key === 'Enter'){
      this.handleSubmit();  
    }
  }
  
  // Cognito login needs to happen sequentially else login won't be finished
  // by the time Auth.currentSession() is called. There is a loading_cognito
  // friction element in place to let the user know it's doing something.
  async handleSubmit() {
    this.setState({
      loading_cognito: true
    });
    
    await Auth.signIn(this.state.userName, this.state.passWord)
      .then(user => {
        this.setState({
          jwttoken: user.signInUserSession.accessToken.jwtToken
        });
        this.handleVerify();
      })
      .catch(err => {
        alert(err.message);
        this.setState({
          loading_cognito: false,
        });
      });
  }
  
  // Once the user has logged in with Cognito, send a query to the server
  // with the JWT to verify it succeeds. Instead of doing a history push,
  // instead reload the url to force React to refresh the state from scratch
  // in order to display the correct account information in the menu.
  async handleVerify() {
    fetch(process.env.REACT_APP_FETCH_ENDPOINT.concat('/auth/verify'), {
      method: 'GET',
      ContentType: 'application/json',
      headers: {
        'Authorization': this.state.jwttoken
      }
    }).then((response) => response.json()).then(responseJSON => {
      if (responseJSON.message === "verify_success") {
        this.setState({
          loading_cognito: false,
        });
        if (this.state.freshlyRegistered) {
          window.location.replace("/account");
        } else {
          window.location.replace("/");
        }
      } else {
        alert("Login failed. Check your username or password and try again.");
        this.setState({
          loading_cognito: false,
          submitDisabled: false
        });
      }
    }).catch(err => {
      alert("Something went wrong contacting the server.");
      this.setState({
        loading_cognito: false,
        submitDisabled: false
      });
    });
  }
  
  handleChange(event) {
    if (event.clipboardData) {
      this.setState({
        [event.target.id]: event.clipboardData.getData('Text')
      });
    } else {
      this.setState({
        [event.target.id]: event.target.value
      });
    }
    if (this.state.userName && this.state.passWord) {
      this.setState({
        submitDisabled: false
      });
    }
  }
  
  handleForgotpassword() {
    this.props.history.push({
      pathname: '/forgotpassword',
      state: this.state.userName,
    });
  }
  
  componentDidMount() {
    document.title = process.env.REACT_APP_PAGE_TITLE.concat(' - Login');
  }
  
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Form onSubmit={e => e.preventDefault()}>
            <Row className="justify-content-center">
              <Col md="8">
                <CardGroup>
                  <Card className="p-1">
                    <CardBody>
                      <h1>Login</h1>
                      <p className="text-muted">Username (email) and password.</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="email" placeholder="Username (email)" id='userName' autoFocus={true} value={this.state.userName} onChange={this.handleChange} onPaste={this.handleChange} />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password" id='passWord' onChange={this.handleChange} onPaste={this.handleChange} onKeyPress={this.handleKeyPress} />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="info" className="px-4" onClick={this.handleSubmit} disabled={this.state.submitDisabled}>Log In</Button>
                        </Col>
                        <Col xs="6">
                          <Button color="link" className="px-4" onClick={this.handleForgotpassword}>Forgot Password</Button>
                        </Col>
                        { this.state.loading_cognito ?
                        <Spinner animation="border" role="status" variant="secondary" />
                        : null
                        }
                      </Row>
                    </CardBody>
                  </Card>
                </CardGroup>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    );
  }
}

export default withRouter(Login);
