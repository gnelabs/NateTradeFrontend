import React from 'react';
import ReactDOM from 'react-dom';
import DopeSight from './DopeSight';
import { shallow } from 'enzyme'


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DopeSight />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders without crashing', () => {
  shallow(<DopeSight />);
});
