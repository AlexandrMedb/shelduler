import React from 'react';
import './App.css';
import {SignInScreen} from './components/authScreen';

import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

const App=() =>{
  return (
    <BrowserRouter>
      <SignInScreen/>
    </BrowserRouter>
  );
};

export default App;
