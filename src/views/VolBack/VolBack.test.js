import React from 'react';
import ReactDOM from 'react-dom';
import VolBack from './VolBack';
import { shallow } from 'enzyme'


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<VolBack />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders without crashing', () => {
  shallow(<VolBack />);
});
