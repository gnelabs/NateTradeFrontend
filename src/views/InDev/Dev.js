import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Dev extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-12 natetrade-maincontent">
            <h1 className="display-4 mt-6 text-dark">In development.</h1>
            <h3 className="mb-6 pb-6 pt-1 text-body">This feature is in development. Stay tuned for future releases.</h3>
          </div>
        </div>
      </React.Fragment>
  );
  }
}

export default withRouter(Dev);
