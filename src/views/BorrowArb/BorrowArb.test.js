import React from 'react';
import ReactDOM from 'react-dom';
import BorrowArb from './BorrowArb';
import { shallow } from 'enzyme'


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BorrowArb />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders without crashing', () => {
  shallow(<BorrowArb />);
});
