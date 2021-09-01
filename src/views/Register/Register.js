import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Card, CardBody, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Spinner } from 'reactstrap';
import { Auth } from 'aws-amplify';


class Register extends Component {
  constructor(props) {
    super(props);
    console.log('props: ', this.props);
    this.state = {
      submitDisabled: true,
      loading_cognito: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleKeyPress(target) {
    if(target.key === 'Enter'){
      this.handleSubmit();  
    }
  }
  
  handleSubmit() {
    console.log(this.state);
    this.setState({
      submitDisabled: true,
      loading_cognito: true
    });
    
    const user = Auth.signUp({
      username: this.state.userName,
      password: this.state.passWord,
      attributes: {
        email: this.state.userName
      }
    }).then(resp => {
      this.props.history.push('/login', { rhUser: this.state.userName });
    }).catch(err => {
      this.setState({
        submitDisabled: false,
        loading_cognito: false
      });
      alert(err.message)
    });
  }
  
  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
    if (this.state.userName && this.state.passWord) {
      this.setState({
        submitDisabled: false
      });
    }
  }
  
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form>
                    
                    { this.state.loading_cognito ?
                    <h1>Register <Spinner animation="border" role="status" variant="secondary" /></h1>
                    :
                    <h1>Register</h1>
                    }
                    <p className="text-muted">Create an account by entering a username (email) and password.</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input type="email" placeholder="Email" id='userName' onChange={this.handleChange} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Password" id='passWord' onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
                    </InputGroup>
                    <Button color="info" block onClick={this.handleSubmit} disabled={this.state.submitDisabled}>Register Account</Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(Register);
