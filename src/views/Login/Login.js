import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Spinner } from 'reactstrap';
import { Auth } from 'aws-amplify';


class Login extends Component {
  constructor(props) {
    super(props);
    console.log('props: ', this.props);
    
    if (this.props.location.state !== undefined && this.props.location.state != null) {
      var predefinedUser = this.props.location.state.rhUser;
    } else {
      var predefinedUser = ''
    }
    
    this.state = {
      submitDisabled: true,
      verifyDisabled: true,
      userName: predefinedUser,
      rh_user_registered: true,
      bySMS: true,
      loading_cognito: false,
      jwttoken: "",
      code: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyPressVerify = this.handleKeyPressVerify.bind(this);
    this.handleVerify = this.handleVerify.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }
  
  handleKeyPress(target) {
    if(target.key === 'Enter'){
      this.handleSubmit();  
    }
  }
  
  handleKeyPressVerify(target) {
    if(target.key === 'Enter'){
      this.handleLogin();
    } 
  }
  
  // Cognito login needs to happen sequentially else login won't be finished
  // by the time Auth.currentSession() is called. There is a loading_cognito
  // friction element in place to let the user know it's doing something.
  async handleSubmit() {
    try {
      this.setState({
        loading_cognito: true
      });
      const user = await Auth.signIn(this.state.userName, this.state.passWord);
      this.setState({
        verifyDisabled: false,
        loading_cognito: false,
        jwttoken: user.signInUserSession.accessToken.jwtToken
      });
      localStorage.setItem("authkeyprefix", user.keyPrefix);
      this.handleVerify();
    } catch (error) {
      alert(error.message);
      this.setState({
        loading_cognito: false,
      });
    }
  }
  
  // Once Cognito is logged in, send login to get 2FA code to generate token.
  handleVerify() {
    fetch('/auth/login', {
      method: 'POST',
      ContentType: 'application/json',
      headers: {
        'Authorization': this.state.jwttoken
      },
      body: JSON.stringify({
        username: this.state.userName,
        password: this.state.passWord,
        sms: this.state.bySMS
      })
    }).then((response) => response.json()).then(responseJSON => {
      if (responseJSON.challenge_id !== "") {
        this.setState({
          code: responseJSON.challenge_id,
          rhCode: responseJSON.challenge_id
        });
        alert(`2FA code (mock): ${responseJSON.challenge_id}`);
      } else {
        alert(responseJSON.message);
      }
    }).catch(err => alert("Something went wrong contacting the server."));
  }
  
  // Login with 2fa code.
  handleLogin() {
    fetch('/auth/loginchallenge', {
      method: 'POST',
      ContentType: 'application/json',
      headers: {
        'Authorization': this.state.jwttoken
      },
      body: JSON.stringify({
        username: this.state.userName,
        password: this.state.passWord,
        sms: this.state.bySMS,
        code: this.state.rhCode,
        challenge: this.state.code
      })
    }).then((response) => response.json()).then(responseJSON => {
      if (responseJSON.login_successful === true) {
        this.props.history.push('/');
      } else {
        alert(responseJSON.message);
      }
    }).catch(err => alert("Something went wrong contacting the server."));
  }
  
  handleChange(event) {
    if (event.target.id !== "bySMS") {
      this.setState({
        [event.target.id]: event.target.value
      });
    } else {
      this.setState({
        [event.target.id]: event.target.checked
      });
    }
    if (this.state.userName && this.state.passWord) {
      this.setState({
        submitDisabled: false
      });
    }
  }
  
  // Display registration card if there are no registered users.
  // Calls a backend unauthenticated route to check to see if there is an
  // existing user in Cognito.
  componentWillMount() {
    if (this.state.userName) {
      this.setState({
        rh_user_registered: true,
      });
    } else {
      fetch('/auth/checkusercreated', {
        method: 'GET',
        ContentType: 'application/json'
      }).then((response) => response.json()).then(responseJSON => {
        if (responseJSON.rh_user_registered !== true) {
          this.setState({
            rh_user_registered: false,
          });
        }
      });
    }
  }
  
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Form>
            <Row className="justify-content-center">
              <Col md="8">
                <CardGroup>
                  <Card className="p-4">
                    <CardBody>
                      <h1>Login</h1>
                      <p className="text-muted">Username and password.</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="email" placeholder="Username" id='userName' value={this.state.userName} onChange={this.handleChange} />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password" id='passWord' onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        Verify by SMS.
                        <Input type="checkbox" id="bySMS" onChange={this.handleChange} checked={this.state.bySMS} />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="info" className="px-4" onClick={this.handleSubmit} disabled={this.state.submitDisabled}>Get Code</Button>
                        </Col>
                        { this.state.loading_cognito ?
                        <Spinner animation="border" role="status" variant="secondary" />
                        : null
                        }
                      </Row>
                    </CardBody>
                  </Card>
                  { this.state.rh_user_registered ?
                  <Card className="text-white bg-info p-4">
                    <CardBody>
                      <h1>Code</h1>
                      <p className="text-muted">Enter your 2FA code.</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" pattern="[0-9]*" placeholder="2FA code" id='rhCode' value={this.state.code} onChange={this.handleChange} onKeyPress={this.handleKeyPressVerify} disabled={this.state.verifyDisabled} />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="secondary" className="mt-3" onClick={this.handleLogin} disabled={this.state.verifyDisabled}>Login</Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  :
                  <Card className="text-white bg-info py-5 d-md-down-none" style={{ width: '50%' }}>
                    <CardBody className="text-center">
                      <div>
                        <h2>Sign up</h2>
                        <p>You need to register your account first something something.</p>
                        <Link to="/register">
                          <Button color="info" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                  }
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
