import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
  Spinner 
} from 'reactstrap';

import portrait_med from '../../assets/img/portrait_natetrade_med.jpg'

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
  
  sendContactEmail() {
    fetch(process.env.REACT_APP_FETCH_ENDPOINT.concat('/newuser/contact'), {
      method: 'POST',
      ContentType: 'application/json',
      body: JSON.stringify({
        "email": this.state.Email,
        "subject": this.state.Subject,
        "message": this.state.Message
      })
    }).then((response) => response.json()).then(responseJSON => {
      if (responseJSON.contact_successful === true) {
        alert("Your email has been submitted.");
        window.location.reload();
      } else {
        alert(responseJSON.message);
      }
    }).catch(err => alert("Something went wrong contacting the server."));
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
        this.sendContactEmail();
      } else {
        alert(responseJSON.message);
        this.setState({
          loadingSpinner: false,
          buttonDisabled: false
        }, this.generateNewCaptchaIdentity);
      }
    }).catch(err => alert("Something went wrong contacting the server."));
  }
  
  componentDidMount() {
    document.title = process.env.REACT_APP_PAGE_TITLE.concat(' - About');
  }
  
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-address-card-o"></i> About NateTrade
              </CardHeader>
              <CardBody>
                <CardTitle tag="h6">Uncommon market trading tools and data to help you find an edge.</CardTitle>
                <CardText>
                  <Row className="pb-3">
                    <Col>
                      <p>
                      There are many strategies for finding edge in the market, and an equal amount of services 
                      you can subscribe to in order to simplify the data. There are services out there that 
                      provide sentiment analysis by looking at discussion boards. There are services out there 
                      that track time and sales data to give you an idea of market flows. I've tried many of 
                      these services. These services work best if you overlay the information with an existing 
                      emotional bias and trading discipline. What does your gut tell you? 
                      </p>
                      <p>
                      I am not ashamed to say I have no idea what the market is doing tomorrow. My gut is not 
                      a reliable source of information. Most traders don't even beat the S&P500, why 
                      would I be any different? Instead, I want to focus on strategies that take advantage of 
                      simple mispricing in the market. Math has no bias.
                      </p>
                      <p>
                      Surprisingly, I have been unable to find any existing service out there for retail traders 
                      that provide me with what I was looking for. Is this only the realm of sophisticated quant 
                      funds, with their alpha cloaked behind a veil of secrecy and NDAs? Is the efficient market 
                      hypothesis actually true? I started this project to find the answer to that question. 
                      This is why I built NateTrade. Whether you are a retail trader on your own or in professional finance, 
                      I hope that you find value here.
                      </p>
                    </Col>
                  </Row>
                  <Row className="bg-light">
                    <Col xs="auto" lg="3">
                      <img src={portrait_med} alt="Me" />
                    </Col>
                    <Col xs="auto" lg="9" className="p-1">
                      <h6>Nathan Ward</h6>
                      <p>
                      Nathan Ward is the founder and developer of NateTrade, a financial insights service. Prior to 
                      NateTrade, Nathan spent 10 years working at Amazon.com, with a focus on cloud software and 
                      infrastructure automation. Nathan has several years of experience independently trading his 
                      own account using a variety of strategies.
                      </p>
                      <p>
                      Nathan currently lives with his wife and children in rural Ohio.
                      </p>
                      <p>
                        <a href="https://twitter.com/thearbguy" target="_blank"><i className="fa fa-twitter fa-lg"></i></a>
                      </p>
                    </Col>
                  </Row>
                </CardText>
              </CardBody>
            </Card>
          </Col>
        </Row>
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
