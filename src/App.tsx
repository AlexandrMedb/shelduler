import React from 'react';
import './App.css';
import {SignInScreen} from './containers/authScreen';

import {BrowserRouter} from 'react-router-dom';
import {Demo} from './demo/demo';
import {CustomDemo} from './demo/customDemo';

const App=() =>{
  return (
    <BrowserRouter>
      <SignInScreen/>
    </BrowserRouter>
    // <>
    //   <CustomDemo/>
    //   <Demo/>
    // </>

  );
};

export default App;
