import React from 'react';
import ReactDOM from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBroadcastTower, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import './styles/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

library.add(faBroadcastTower, faPaperPlane)

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
