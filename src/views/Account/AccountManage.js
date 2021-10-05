import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
  Spinner 
} from 'reactstrap';
import { Auth } from 'aws-amplify';
import timeZones from '../../_tz';


class AccountManage extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      jwttoken: "",
      email: "",
      alias: "",
      timezone: "",
      dropdownOpen: false,
      timeZoneDropDownList: [],
      timeZoneMatching: {},
      timeToSet: "Select ",
      aliasToSet: "",
      buttonDisabled: true,
      loadingSpinner: true
    };
    
    this.toggle = this.toggle.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  
  getJwtAndAttributesOrRedirect() {
    // Get jwt or redirect to login if missing.
    Auth.currentAuthenticatedUser()
      .then(result => {
        this.setState({
          jwttoken: (result.signInUserSession.accessToken.jwtToken),
          email: result.attributes.email,
          alias: result.attributes['custom:alias'],
          timezone: result.attributes['custom:timezone']
        });
      })
      .catch(err => { 
        this.props.history.push({
          pathname: '/login'
        });
      });
  }
  
  // Read the list of timezones and filter so it can be displayed in the dropdown.
  curateTimeZones() {
    let tzlabels = []
    let tzdict = {}
    
    for (let item of timeZones) {
      tzlabels.push(item.label.concat(" ", item.value));
      tzdict[item.label.concat(" ", item.value)] = item.value;
    }
    
    this.setState({
      timeZoneDropDownList: tzlabels,
      timeZoneMatching: tzdict,
      loadingSpinner: false
    });
  }
  
  // Dropdown open/close toggler.
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }
  
  // Dropdown selector.
  handleClick(event) {
    this.setState({
      timeToSet: event.currentTarget.textContent,
      buttonDisabled: false
    });
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
  
  handleKeyPress(target) {
    if(target.key === 'Enter'){
      this.handleSubmit();  
    }
  }
  
  componentDidMount() {
    this.getJwtAndAttributesOrRedirect();
    this.curateTimeZones();
  }
  
  tzUpdate(user, timezone) {
    // A GMT +00:00 timezone setting means remove the attribute since all data is already UTC.
    if (timezone === "+00:00") {
      Auth.deleteUserAttributes(user, ["custom:timezone"])
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
      Auth.updateUserAttributes(user, {"custom:timezone": timezone})
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
  
  async handleSubmit() {
    const user = await Auth.currentAuthenticatedUser();
    
    this.setState({
      loadingSpinner: true
    });
    
    if (this.state.timeToSet !== "Select ") {
      this.tzUpdate(user, this.state.timeZoneMatching[this.state.timeToSet]);
    }
    
    if (this.state.aliasToSet) {
      this.aliasUpdate(user, this.state.aliasToSet);
    } else {
      // Previous alias present, no alias specified means delete.
      if (this.state.alias) {
        this.aliasUpdate(user, "");
      }
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
                  <FormGroup row>
                    <Col md="6">
                    { this.state.timezone ?
                      <Label htmlFor="text-input"><strong>Time Zone</strong> (optional) - Currently set to {this.state.timezone}</Label>
                    :
                      <Label htmlFor="text-input"><strong>Time Zone</strong> (optional)</Label>
                    }
                    </Col>
                    <Col xs="12" md="9">
                      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                        <DropdownToggle caret>
                          {this.state.timeToSet}
                        </DropdownToggle>
                        <DropdownMenu
                          modifiers={{
                            setMaxHeight: {
                              enabled: true,
                              fn: (data) => {
                                return {
                                  ...data,
                                  styles: {
                                    ...data.styles,
                                    overflow: 'auto',
                                    maxHeight: '640px',
                                  },
                                };
                              },
                            },
                          }}
                        >
                        { this.state.timeZoneDropDownList.map((value, index) => (
                          <DropdownItem onClick={this.handleClick}>{value}</DropdownItem>
                        ))}
                        </DropdownMenu>
                      </Dropdown>
                      <FormText color="muted">
                        Choose a time zone if you want timestamps displayed on this website to be adjusted 
                        to your local time zone. Choose GMT +00:00 to remove or set back to default. All data stored 
                        on NateTrade is localized to UTC.
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
                      <Button type="submit" color="secondary" disabled={true} >Submit</Button>
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
                      <Button type="submit" color="secondary" disabled={this.state.buttonDisabled} onClick={this.handleSubmit} >Submit</Button>
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
