import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.scss';
import Amplify, { Auth } from 'aws-amplify';

const loading = () => {
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

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));
const UserLayout = React.lazy(() => import('./containers/AuthLayout'));

// Setup auth
// Defined in env variables set on build.
if (process.env.NODE_ENV !== 'production') {
  Amplify.configure({
    Auth: {
      identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID,
      region: process.env.REACT_APP_AWS_REGION,
      userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
      userPoolWebClientId: process.env.REACT_APP_COGNITO_USER_POOL_WEB_CLIENT_ID
    }
  });
} else {
  Amplify.configure({
    Auth: {
      identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID_PROD,
      region: process.env.REACT_APP_AWS_REGION_PROD,
      userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID_PROD,
      userPoolWebClientId: process.env.REACT_APP_COGNITO_USER_POOL_WEB_CLIENT_ID_PROD
    }
  });
}


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/" name="Home" component={DefaultLayout} />
            <Route path="/divvyarb" name="DivvyArb" component={DefaultLayout} />
            <Route path="/login" name="Login Page" component={UserLayout} />} />
            <Route path="/register" name="Register" component={UserLayout} />} />
            <Route path="/account" name="AccountManage" component={DefaultLayout} />
            <Route path="/indev" name="InDevelopment" component={DefaultLayout} />
            <Route path="/about" name="About" component={DefaultLayout} />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    );
  }
}

export default App;
