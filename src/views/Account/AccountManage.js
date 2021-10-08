import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
  Spinner 
} from 'reactstrap';
import { Auth } from 'aws-amplify';


class AccountManage extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      jwttoken: "",
      email: "",
      alias: "",
      aliasToSet: "",
      passwordExistingFieldDisabled: true,
      buttonDisabled: true,
      passwordButtonDisabled: true,
      loadingSpinner: false
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
  }
  
  getJwtAndAttributesOrRedirect() {
    // Get jwt or redirect to login if missing.
    Auth.currentAuthenticatedUser()
      .then(result => {
        this.setState({
          jwttoken: (result.signInUserSession.accessToken.jwtToken),
          email: result.attributes.email,
          alias: result.attributes['custom:alias']
        });
      })
      .catch(err => { 
        this.props.history.push({
          pathname: '/login'
        });
      });
  }
  
  // Logs out and sends the user to /login.
  async signOut() {
    await Auth.signOut()
      .then(data => window.location.reload());
  }
  
  // Text box input.
  handleChange(event) {
    if (event.clipboardData) {
      this.setState({
        buttonDisabled: false,
        aliasToSet: event.clipboardData.getData('Text')
      });
    } else {
      this.setState({
        buttonDisabled: false,
        aliasToSet: event.target.value
      });
    }
  }
  
  // Password text box input.
  handlePassword(event) {
    if (event.clipboardData) {
      this.setState({
        passwordExistingFieldDisabled: false,
        [event.target.id]: event.clipboardData.getData('Text')
      });
    } else {
      this.setState({
        passwordExistingFieldDisabled: false,
        [event.target.id]: event.target.value
      });
    }
    
    if (this.state.PasswordNew && this.state.PasswordOld) {
      this.setState({
        passwordButtonDisabled: false
      });
    }
  }
  
  handleKeyPress(target) {
    if(target.key === 'Enter'){
      this.handleSubmit();  
    }
  }
  
  componentDidMount() {
    this.getJwtAndAttributesOrRedirect();
  }
  
  aliasUpdate(user, alias) {
    // No attributes to set means delete the alias.
    if (alias) {
      Auth.updateUserAttributes(user, {"custom:alias": alias})
        .then(result => {
          this.getJwtAndAttributesOrRedirect();
        })
        .catch(err => { 
          alert(err.message);
        })
        .finally(err => { 
          this.setState({
            loadingSpinner: false
          });
        });
    } else {
      Auth.deleteUserAttributes(user, ["custom:alias"])
        .then(result => {
          this.getJwtAndAttributesOrRedirect();
        })
        .catch(err => { 
          alert(err.message);
        })
        .finally(err => { 
          this.setState({
            loadingSpinner: false
          });
        });
    }
  }
  
  passwordUpdate(user, oldpass, newpass) {
    Auth.changePassword(user, oldpass, newpass)
      .then(result => {
        this.signOut();
      })
      .catch(err => { 
        alert(err.message);
      })
      .finally(err => { 
        this.setState({
          loadingSpinner: false
        });
      });
  }
  
  async handleSubmit() {
    const user = await Auth.currentAuthenticatedUser();
    
    this.setState({
      loadingSpinner: true
    });
    
    if (this.state.aliasToSet) {
      this.aliasUpdate(user, this.state.aliasToSet);
    } else {
      // Previous alias present, no alias specified means delete.
      if (this.state.alias) {
        this.aliasUpdate(user, "");
      }
    }
  }
  
  async handlePasswordSubmit() {
    const user = await Auth.currentAuthenticatedUser();
    
    this.setState({
      loadingSpinner: true
    });
    
    if (this.state.PasswordNew && this.state.PasswordOld) {
      this.passwordUpdate(user, this.state.PasswordOld, this.state.PasswordNew);
    }
  }
  
  // The form needs to have preventdefault set for onSubmit to ignore the built-in form enter key trigger.
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-address-card-o"></i> Manage settings for user <strong>{this.state.email}</strong>
              </CardHeader>
              <CardBody>
                <Form onSubmit={e => e.preventDefault()} className="form-horizontal">
                  <FormGroup row>
                    <Col md="6">
                    { this.state.alias ?
                      <Label htmlFor="text-input"><strong>User Alias</strong> (optional) - Currently set to {this.state.alias}</Label>
                    :
                      <Label htmlFor="text-input"><strong>User Alias</strong> (optional)</Label>
                    }
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="Alias" name="Alias" autoFocus={true} onChange={this.handleChange} onPaste={this.handleChange} onKeyPress={this.handleKeyPress} />
                      <FormText color="muted">
                        A user alias is required to post notes and messages. This is the name that will be  
                        next to your message. You can use your name, a psuedonym, or anything within reason.
                        Keep it classy. To delete your alias, submit an empty one.
                      </FormText>
                    </Col>
                  </FormGroup>
                </Form>
              </CardBody>
              <CardFooter>
              { this.state.loadingSpinner ?
                <div>
                  <Row>
                    <Col>
                      <Button type="submit" color="secondary" disabled={true} >Submit Settings</Button>
                    </Col>
                    <Col>
                      <Spinner animation="border" role="status" variant="secondary" />
                    </Col>
                  </Row>
                </div>
              :
                <div>
                  <Row>
                    <Col>
                      <Button type="submit" color="secondary" disabled={this.state.buttonDisabled} onClick={this.handleSubmit} >Submit Settings</Button>
                    </Col>
                    <Col>
                    </Col>
                  </Row>
                </div>
              }
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-lock"></i> Manage Security
              </CardHeader>
              <CardBody>
                <Form onSubmit={e => e.preventDefault()} className="form-horizontal">
                  <FormGroup row>
                    <Col md="6">
                      <Label htmlFor="text-input"><strong>Change password</strong></Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="password" id="PasswordNew" name="PasswordNew" placeholder="new password" onChange={this.handlePassword} onPaste={this.handlePassword} onKeyPress={this.handleKeyPress} />
                    </Col>
                    <Col xs="12" md="9">
                    { this.state.PasswordNew ?
                      <Input type="password" id="PasswordOld" name="PasswordOld" placeholder="current passsword" onChange={this.handlePassword} onPaste={this.handlePassword} onKeyPress={this.handleKeyPress} />
                    :
                      <Input type="password" id="PasswordOld" name="PasswordOld" placeholder="current passsword" onChange={this.handlePassword} onPaste={this.handlePassword} onKeyPress={this.handleKeyPress} disabled />
                    }  
                      <FormText color="muted">
                        Once you enter the new password, enter your existing password to confirm your identity. 
                        You will be logged out after you submit. Log in with your updated password.
                      </FormText>
                    </Col>
                  </FormGroup>
                </Form>
              </CardBody>
              <CardFooter>
              { this.state.loadingSpinner ?
                <div>
                  <Row>
                    <Col>
                      <Button type="submit" color="secondary" disabled={true} >Submit Password</Button>
                    </Col>
                    <Col>
                      <Spinner animation="border" role="status" variant="secondary" />
                    </Col>
                  </Row>
                </div>
              :
                <div>
                  <Row>
                    <Col>
                      <Button type="submit" color="secondary" disabled={this.state.passwordButtonDisabled} onClick={this.handlePasswordSubmit} >Submit Password</Button>
                    </Col>
                    <Col>
                    </Col>
                  </Row>
                </div>
              }
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(AccountManage);
