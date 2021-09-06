import React, { Component } from 'react';
import { Nav } from 'reactstrap';
import PropTypes from 'prop-types';
import { Badge } from 'reactstrap';
import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import { Auth } from 'aws-amplify';

import logo_main from '../../assets/img/brand/nt_top_small1.png'
import logo_small_tr from '../../assets/img/brand/nt_top_minimized1.png'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};



class DefaultHeader extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      jwttoken: "",
      hoursUntilExpiry: 0,
      badgeColor: 'light'
    };
  }
  
  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo_main, width: 250, height: 50, alt: 'NateTrade' }}
          minimized={{ src: logo_small_tr, width: 48, height: 50, alt: 'NateTrade' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg">
            &nbsp; <span className="navbar-toggler-icon" /> Menu
        </AppSidebarToggler>
        <Nav className="ml-auto pr-2" navbar>
          <small>Not logged in</small>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
