import React from 'react';
import ReactDOM from 'react-dom';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../../store/index';
import ProfileSection from '../../../../layout/MainLayout/Header/ProfileSection';

const render = (component) => rtlRender(<Provider store={store}>{component}</Provider>);

describe('render without crashing', () => {
    it('it should not crash', () => {
        let div = document.createElement('div');
        render(<ProfileSection />, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});