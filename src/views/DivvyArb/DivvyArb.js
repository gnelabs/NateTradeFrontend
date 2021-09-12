import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { Auth } from 'aws-amplify';

class DivvyArb extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      jwttoken: ""
    };
  }
  
  async componentWillMount() {
    await Auth.currentAuthenticatedUser()
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
  
  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-12">
            <div className="animated fadeIn">
              <div className="card bg-light mb-3">
                <h4 className="card-header">Dividend Arbitrage</h4>
                <div className="card-body">
                This feature is in development and will be released shortly.
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
  );
  }
}

export default withRouter(DivvyArb);
