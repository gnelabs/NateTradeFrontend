import React from 'react';
import ReactDOM from 'react-dom';
import DivvyArb from './DivvyArb';
import { shallow } from 'enzyme'


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DivvyArb />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders without crashing', () => {
  shallow(<DivvyArb />);
});
