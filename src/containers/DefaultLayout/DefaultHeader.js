import React, { Component } from 'react';
import { Nav } from 'reactstrap';
import PropTypes from 'prop-types';
import { Badge } from 'reactstrap';
import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import { Auth } from 'aws-amplify';

import logo_main from '../../assets/img/brand/g_small.png'
import logo_small_tr from '../../assets/img/brand/g_small.png'

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
          full={{ src: logo_main, width: 80, height: 52, alt: 'Logo' }}
          minimized={{ src: logo_small_tr, width: 80, height: 52, alt: 'Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg">
            &nbsp; <span className="navbar-toggler-icon" /> Menu
        </AppSidebarToggler>
        <Nav className="ml-auto" navbar>
          Text
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
