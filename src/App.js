import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
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
// Parse the html provided by lambda for NateTradeEnvInfo server side info.
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
  const ServerSideDetails = JSON.parse(document.getElementById('NateTradeEnvInfo').dataset.envinfo);
  Amplify.configure({
    Auth: {
      identityPoolId: ServerSideDetails.cognitoIdentityPoolId,
      region: ServerSideDetails.awsRegion,
      userPoolId: ServerSideDetails.cognitoUserPoolId,
      userPoolWebClientId: ServerSideDetails.cognitoUserPoolWebClientId
    }
  });
}

// Routes that require a JWT to work. Server side there is no auth, so client side will redirect.
// Cognito populates LastAuthUser, and clears this out if the session is expired.
const PrivateRoute = ({ component: Component, ...rest }) => {
  if (localStorage.getItem("authkeyprefix")) {
    if (localStorage.getItem(localStorage.getItem("authkeyprefix").concat('.', "LastAuthUser")) !== null) {
      return (
        <Route {...rest} render={props => <Component {...props} />} />
      );
    } else {
      return (
        <Redirect to="/login" />
      );
    }
  } else {
    return (
      <Redirect to="/login" />
    );
  }
};

// Pages
const Login = React.lazy(() => import('./views/Login'));
const Register = React.lazy(() => import('./views/Register'));

class App extends Component {
  async componentDidMount() {
    await Auth.currentAuthenticatedUser()
      .then(user => {
        localStorage.setItem("authkeyprefix", user.keyPrefix); // Username
      })
      .catch(err => {
        if (err === "The user is not authenticated") {
          localStorage.setItem("authkeyprefix", false);
        } else if (err ==="No current user") {
          localStorage.setItem("authkeyprefix", false);
        } else {
          console.log('Authentication issue: ', err);
        }
      });
  }
  
  render() {
    return (
      <BrowserRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/" name="Home" component={DefaultLayout} />
            <Route path="/login" name="Login Page" component={UserLayout} />} />
            <Route path="/register" name="Register" component={UserLayout} />} />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    );
  }
}

export default App;
