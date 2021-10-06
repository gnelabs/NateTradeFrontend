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

class About extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      captchaIdentity: "",
      captchaImageURL: "",
      captchaString: "",
      buttonDisabled: true,
      loadingSpinner: false
    };
    
    this.handleCaptcha = this.handleCaptcha.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  
  // Text box input.
  handleCaptcha(event) {
    this.setState({
      buttonDisabled: false,
      captchaString: event.target.value
    });
    
    if (this.state.Email && this.state.Subject && this.state.Message && this.state.captchaString) {
      this.setState({
        buttonDisabled: false
      });
    }
  }
  
  handleEmail(event) {
    if (event.clipboardData) {
      this.setState({
        [event.target.id]: event.clipboardData.getData('Text')
      });
    } else {
      this.setState({
        [event.target.id]: event.target.value
      });
    }
  }
  
  // Generate a random number up to 10 digits.
  generateNewCaptchaIdentity() {
    var iden = Math.floor(Math.random() * (9999999999 - 0 + 1)) + 0;
    this.setState({
      captchaIdentity: iden,
      captchaImageURL: process.env.REACT_APP_FETCH_ENDPOINT.concat('/newuser/captcha?identity=').concat(iden)
    });
  }
  
  // If the page is reloaded, a new identity is generated and thus a new captcha is downloaded.
  componentDidMount() {
    this.generateNewCaptchaIdentity();
  }
  
  handleKeyPress(target) {
    if(target.key === 'Enter'){
      this.handleSubmit();  
    }
  }
  
  handleSubmit() {
    this.setState({
      loadingSpinner: true,
      buttonDisabled: true
    });
    
    fetch(process.env.REACT_APP_FETCH_ENDPOINT.concat('/newuser/captcha'), {
      method: 'POST',
      ContentType: 'application/json',
      body: JSON.stringify({
        "identity": this.state.captchaIdentity,
        "captchastring": this.state.captchaString
      })
    }).then((response) => response.json()).then(responseJSON => {
      if (responseJSON.captcha_successful === true) {
        alert("Your email has been submitted.");
        window.location.reload();
      } else {
        alert(responseJSON.message);
        this.setState({
          loadingSpinner: false,
          buttonDisabled: false
        }, this.generateNewCaptchaIdentity);
      }
    }).catch(err => alert("Something went wrong contacting the server."));
  }
  
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-inbox"></i> Contact Form
              </CardHeader>
              <CardBody>
                <Form onSubmit={e => e.preventDefault()} className="form-horizontal">
                  <FormGroup row>
                    <Col md="6">
                      <Label htmlFor="text-input">Email</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="email" id="Email" name="Email" autoFocus={true} onChange={this.handleEmail} onPaste={this.handleEmail} />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="6">
                      <Label htmlFor="text-input">Subject</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="Subject" name="Subject" onChange={this.handleEmail} onPaste={this.handleEmail} />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="6">
                      <Label htmlFor="text-input">Message</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="textarea" id="Message" name="Message" onChange={this.handleEmail} onPaste={this.handleEmail} style={{ height: 120 }} />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="6">
                      Enter CAPTCHA text: <img src={ this.state.captchaImageURL } alt="Please type the captcha letters you see."></img>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="Captcha" name="Captcha" onChange={this.handleCaptcha} onKeyPress={this.handleKeyPress} />
                      <FormText color="muted">
                        Enter the CAPTCHA letters to confirm you are human. The CAPTCHA will be upper-case letters only. 
                        The current CAPTCHA will expire after 30 minutes.
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
                      <Button type="submit" color="secondary" disabled={true} >Send Email</Button>
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
                      <Button type="submit" color="secondary" disabled={this.state.buttonDisabled} onClick={this.handleSubmit} >Send Email</Button>
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

export default withRouter(About);
