import { Auth } from 'aws-amplify';

// Logs out and reloads, which will make the user redirected to /login.
async function signOut() {
  await Auth.signOut();
  window.location.reload();
}

// Sign out link. Revokes the session.
const displaySignOut = {
  name: 'Log Out',
  url: '/login',
  icon: 'fa fa-sign-out',
  attributes: { onClick: signOut },
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

const navMenu = {
  items: [
    {
      name: 'Home',
      url: '/',
      icon: 'fa fa-home',
      attributes: { exact: true },
    },
    {
      title: true,
      name: 'Arbitrage Strategies',
    },
    {
      name: 'Divvy Arbs',
      url: '/divvyarb',
      icon: 'fa fa-money',
      attributes: { exact: true },
    },
    {
      title: true,
      name: 'Account',
    }
  ]
};

// Checks the cognito session to see if it's valid.
const isSignedIn = async () => {
  const result = await Auth.currentAuthenticatedUser().catch(reason => {});
  return result;
}

(async () => {
  if (await isSignedIn() !== undefined) {
    navMenu.items.push(displaySignOut);
  } else {
    navMenu.items.push(displaySignIn);
    navMenu.items.push(displayRegister);
  }
})();


export default navMenu;