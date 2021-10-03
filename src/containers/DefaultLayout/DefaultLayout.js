import React, { Component, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import { Auth } from 'aws-amplify';

import {
  AppBreadcrumb,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';

const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      navMenu: {
        items: []
      }
    };
  }
  
  loading = () => {
    return (
        <div className="sk-circle">
            <div className="sk-circle1 sk-child"></div>
            <div className="sk-circle2 sk-child"></div>
            <div className="sk-circle3 sk-child"></div>
            <div className="sk-circle4 sk-child"></div>
            <div className="sk-circle5 sk-child"></div>
            <div className="sk-circle6 sk-child"></div>
            <div className="sk-circle7 sk-child"></div>
            <div className="sk-circle8 sk-child"></div>
            <div className="sk-circle9 sk-child"></div>
            <div className="sk-circle10 sk-child"></div>
            <div className="sk-circle11 sk-child"></div>
            <div className="sk-circle12 sk-child"></div>
        </div>
    );
  }
  
  // Logs out and sends the user to /login.
  async signOut() {
    await Auth.signOut();
  }
  
  // Dynamically generate some menu items depending on whether or not the user is logged in.
  dynamicMenu() {
    // Account title
    const accountTitle = {
      title: true,
      name: 'Account'
    }
    
    // Sign in link, redirects to login page.
    const displaySignIn = {
      name: 'Log In',
      url: '/login',
      icon: 'fa fa-sign-in',
      attributes: { exact: true },
    }

    // Register link, redirects to register page.
    const displayRegister = {
      name: 'Register',
      url: '/register',
      icon: 'fa fa-share-square-o',
      attributes: { exact: true },
    }
    
    // Generic divider to clean up the menu
    const divider = {
      divider: true,
      class: 'm-2'
    }
    
    // Signed in user, display account manage and sign out links.
    const signedInDisplay = {
      name: 'Account',
      icon: 'fa fa-user-circle-o',
      itemAttr: { id: 'account-signed-in' },
      children: [
        {
          name: 'Account Settings',
          url: '/account',
          attributes: { exact: true },
        },
        {
          name: 'Log Out',
          url: '/login',
          attributes: { onClick: this.signOut },
        },
      ],
    }
    
    Auth.currentAuthenticatedUser()
      .then(user => {
        var joined = navigation.items.concat(divider, signedInDisplay);
        this.setState({
          navMenu: {items: joined}
        });
      })
      .catch(err => {
        var joined = navigation.items.concat(accountTitle, displaySignIn, displayRegister);
        this.setState({
          navMenu: {items: joined}
        });
      })
  }
  
  componentDidMount() {
    this.dynamicMenu();
  }

  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav navConfig={this.state.navMenu} {...this.props} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes}/>
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <route.component {...props} />
                        )} />
                    ) : (null);
                  })}
                </Switch>
              </Suspense>
            </Container>
          </main>
        </div>
      </div>
    );
  }
}

export default DefaultLayout;
