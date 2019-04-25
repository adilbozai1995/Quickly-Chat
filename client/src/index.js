import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import login from './login';
import chat from './chat';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter, Route,Switch} from 'react-router-dom';


ReactDOM.render(
    
<BrowserRouter>
<Switch>
    <div>
      <Route exact path='/' component={login}/>
      <Route exact path='/chat' component={chat}/>
    </div>
    </Switch>
</BrowserRouter>,




document.getElementById('root')

);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
