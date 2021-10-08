import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { 
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
  Spinner
} from 'reactstrap';
import { Auth } from 'aws-amplify';


class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    
    // The state is passed from login if the username is already filled out.
    if (this.props.location.state !== undefined && this.props.location.state != null) {
      this.state = {
        predefinedUser: this.props.location.state,
      };
    } else {
      this.state = {
        predefinedUser: "",
      };
    }
    
    this.state = {
      submitResetDisabled: this.state.predefinedUser ? false : true,
      loading_cognito: false,
      submitDisabled: true,
      userName: this.state.predefinedUser
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSendResetEmail = this.handleSendResetEmail.bind(this);
    this.handleResetChange = this.handleResetChange.bind(this);
    this.handleKeyPressEmail = this.handleKeyPressEmail.bind(this);
    this.handleKeyPressPassword = this.handleKeyPressPassword.bind(this);
  }
  
  handleKeyPressEmail(target) {
    if(target.key === 'Enter'){
      if (this.state.userName) {
        this.handleResetChange();
      } 
    }
  }
  
  handleKeyPressPassword(target) {
    if(target.key === 'Enter'){
      if (this.state.resetCode && this.state.newPassword) {
        this.handleSubmit();
      } 
    }
  }
  
  async handleSendResetEmail() {
    this.setState({
      loading_cognito: true
    });
    
    await Auth.forgotPassword(this.state.userName)
      .then(user => {
        this.setState({
          loading_cognito: false
        });
      })
      .catch(err => {
        alert(err.message);
        this.setState({
          loading_cognito: false
        });
      });
  }
  
  async handleSubmit() {
    this.setState({
      loading_cognito: true,
      submitDisabled: true
    });
    
    await Auth.forgotPasswordSubmit(this.state.userName, this.state.resetCode, this.state.newPassword)
      .then(user => {
        this.props.history.push({
          pathname: '/login'
        });
      })
      .catch(err => {
        alert(err.message);
        this.setState({
          loading_cognito: false,
          submitDisabled: false
        });
      });
  }
  
  handleResetChange(event) {
    if (event.clipboardData) {
      this.setState({
        userName: event.clipboardData.getData('Text')
      });
    } else {
      this.setState({
        userName: event.target.value
      });
    }
    if (this.state.userName) {
      this.setState({
        submitResetDisabled: false
      });
    }
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
    if (this.state.resetCode && this.state.newPassword) {
      this.setState({
        submitDisabled: false
      });
    }
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
                      <FormGroup row>
                        <Col md="6">
                          <Label htmlFor="text-input">Forgot Password</Label>
                        </Col>
                        <Col xs="12" md="9">
                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="icon-user"></i>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input type="email" placeholder="Username (email)" id='userName' autoFocus={true} value={this.state.userName} onChange={this.handleResetChange} onPaste={this.handleResetChange} onKeyPress={this.handleKeyPressEmail} />
                            <FormText color="muted">
                              First submit a forgot password request. Check your email for the password reset code. 
                              The sending address will be no-reply@verificationemail.com.
                            </FormText>
                          </InputGroup>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Col xs="6">
                          <Button color="info" className="px-4" onClick={this.handleSendResetEmail} disabled={this.state.submitResetDisabled}>Send Reset Email</Button>
                        </Col>
                        { this.state.loading_cognito ?
                        <Col xs="6">
                          <Spinner animation="border" role="status" variant="secondary" />
                        </Col>
                        : null
                        }
                      </FormGroup>
                      <hr style={{color: "primary", backgroundColor: "white", height: 5}} />
                      <FormGroup row>
                        <Col md="6">
                          <Label htmlFor="text-input">Password Reset Code</Label>
                        </Col>
                        <Col xs="12" md="9">
                          <InputGroup className="mb-3">
                            <Input type="text" placeholder="Reset Code" id='resetCode' onChange={this.handleChange} onPaste={this.handleChange} onKeyPress={this.handleKeyPressPassword} />
                          </InputGroup>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Col md="6">
                          <Label htmlFor="text-input">New Password</Label>
                        </Col>
                        <Col xs="12" md="9">
                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="icon-lock"></i>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input type="password" id='newPassword' onChange={this.handleChange} onPaste={this.handleChange} onKeyPress={this.handleKeyPressPassword} />
                          </InputGroup>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Col xs="6">
                          <Button color="info" className="px-4" onClick={this.handleSubmit} disabled={this.state.submitDisabled}>Reset Password</Button>
                        </Col>
                        { this.state.loading_cognito ?
                        <Col xs="6">
                          <Spinner animation="border" role="status" variant="secondary" />
                        </Col>
                        : null
                        }
                      </FormGroup>
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

export default withRouter(ForgotPassword);
