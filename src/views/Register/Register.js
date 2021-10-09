import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Nav, NavItem, NavLink, Row, Spinner, TabContent, TabPane } from 'reactstrap';
import { Auth } from 'aws-amplify';
import classnames from 'classnames';


class Register extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      submitDisabled: true,
      loading_cognito: false,
      agreement_checked: false,
      activeTab: '1'
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
    this.handleLegalAgreement = this.handleLegalAgreement.bind(this);
  }
  
  // Helper for tabs.
  toggleTab(tab) {
    if (this.state.activeTab !== tab ) {
      this.setState({
        activeTab: tab
      });
    }
  }
  
  // Legal agreement.
  handleLegalAgreement() {
    this.setState({
      activeTab: '2',
      agreement_checked: true
    });
    
  }
  
  // One handing it.
  handleKeyPress(target) {
    if(target.key === 'Enter'){
      this.handleSubmit();  
    }
  }
  
  async handleSubmit() {
    this.setState({
      submitDisabled: true,
      loading_cognito: true
    });
    
    // Sign up with email as username.
    const user = await Auth.signUp({
      username: this.state.userName,
      password: this.state.passWord,
      attributes: {
        email: this.state.userName
      }
    }).catch(err => {
      alert(err.message);
      this.setState({
        submitDisabled: false,
        loading_cognito: false
      });
    });
    
    // Wait until user is confirmed before redirecting to login page.
    if (user !== undefined) {
      const userConfirmed = !!user.userConfirmed;
      
      this.setState({
        submitDisabled: !userConfirmed,
        loading_cognito: !userConfirmed
      });
      
      if (userConfirmed === true) {
        this.props.history.push({
          pathname: '/login',
          state: this.state.userName,
        });
      }
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
    if (this.state.userName && this.state.passWord) {
      this.setState({
        submitDisabled: false
      });
    }
  }
  
  componentDidMount() {
    document.title = process.env.REACT_APP_PAGE_TITLE.concat(' - Register');
  }
  
  render() {
    return (
      <div className="app flex-row mt-5">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '1' })}
                    onClick={() => { this.toggleTab('1'); }}>
                    Agreements
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '2' })}
                    onClick={() => { this.toggleTab('2'); }}>
                    Registration
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1" className="mx-0 p-1">
                  { this.state.activeTab === '1' ? 
                    <Form>
                      <React.Fragment>
                        <h1>Legal Disclaimer</h1>
                        <ul>
                          <li>
                            This website is for informational and entertainment purposes only, and does not constitute a recommendation to buy or sell any security.
                          </li>
                          <li>
                            The information on this website should not be construed as investment advice.
                          </li>
                          <li>
                            NateTrade LLC is not liable for your losses.
                          </li>
                          <li>
                            Investing carries risk, and you are solely responsible for your investment decisions.
                          </li>
                        </ul>
                        <h1>Data Disclaimer</h1>
                        <ul>
                          <li>
                            Your email will never be shared with or sold to any affiliate or marketing firm, you will only be contacted about products and news related to NateTrade.
                          </li>
                          <li>
                            Personal data stored at NateTrade follows information security industry best practices.
                          </li>
                          <li>
                            We do not use tracking cookies.
                          </li>
                          <li>
                            Market data is provided on a best effort basis.
                          </li>
                        </ul>
                        <Button color="info" block onClick={this.handleLegalAgreement}>I Agree</Button>
                      </React.Fragment>
                    </Form>
                  : null
                  }
                </TabPane>
                <TabPane tabId="2" className="mx-1 p-1 fixed-height-tab">
                  { this.state.activeTab === '2' ? 
                  <Form>
                    { this.state.loading_cognito ?
                    <h1>Register <Spinner animation="border" role="status" variant="secondary" /></h1>
                    :
                    <h1>Register</h1>
                    }
                    <p className="text-muted">Create an account by entering a username (email) and password.</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-envelope-o"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="email" placeholder="Email" id='userName' autoFocus={true} onChange={this.handleChange} onPaste={this.handleChange} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Password" id='passWord' onChange={this.handleChange} onPaste={this.handleChange} onKeyPress={this.handleKeyPress} />
                    </InputGroup>
                    <Button color="info" block onClick={this.handleSubmit} disabled={this.state.submitDisabled}>Register Account</Button>
                  </Form>
                  : null
                  }
                </TabPane>
              </TabContent>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(Register);
