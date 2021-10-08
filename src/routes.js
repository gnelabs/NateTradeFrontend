import React from 'react';

const Home = React.lazy(() => import('./views/Home'));
const Login = React.lazy(() => import('./views/Login'));
const Register = React.lazy(() => import('./views/Register'));
const DivvyArb = React.lazy(() => import('./views/DivvyArb'));
const AccountManage = React.lazy(() => import('./views/Account'));
const Dev = React.lazy(() => import('./views/InDev'));
const About = React.lazy(() => import('./views/About'));
const ForgotPassword = React.lazy(() => import('./views/ForgotPassword'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'NateTrade', component: Home},
  { path: '/login', exact: true, name: 'Login', component: Login},
  { path: '/register', exact: true, name: 'Register', component: Register},
  { path: '/divvyarb', exact: true, name: 'DivvyArb', component: DivvyArb},
  { path: '/account', exact: true, name: 'AccountManage', component: AccountManage},
  { path: '/indev', exact: true, name: 'InDevelopment', component: Dev},
  { path: '/about', exact: true, name: 'About', component: About},
  { path: '/forgotpassword', exact: true, name: 'ForgotPassword', component: ForgotPassword}
];

export default routes;
