import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Home.scss'
import { Auth } from 'aws-amplify';

class Home extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-12 natetrade-maincontent">
            <h1 className="display-4 mt-6 text-dark">Welcome to <em>NateTrade.</em></h1>
            <h2 className="mb-6 pb-6 pt-1 text-body">Uncommon market trading tools and data to help you find an edge.</h2>
          </div>
          <div className="col-12 natetrade-maincontent">
            <div className="animated fadeIn">
              <div className="card bg-light mb-3">
                <h4 className="card-header">What's New</h4>
                <div className="card-body">
                This website is under development. Stay tuned, new stuff will be coming online shortly.
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
  );
  }
}

export default withRouter(Home);
