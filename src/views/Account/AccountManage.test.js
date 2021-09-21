import React from 'react';
import ReactDOM from 'react-dom';
import AccountManage from './AccountManage';
import { shallow } from 'enzyme'


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AccountManage />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders without crashing', () => {
  shallow(<AccountManage />);
});
