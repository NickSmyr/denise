'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './component/App'

const e = React.createElement;

//ReactDOM.render(
//  <App />,
//  document.getElementById('root')
//);

const domContainer = document.querySelector('#root');
ReactDOM.render(e(App), domContainer);
