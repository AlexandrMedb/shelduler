import React from 'react';
import './App.css';
import {SignInScreen} from './containers/authScreen';

import {BrowserRouter} from 'react-router-dom';


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
