import React from 'react';
import './App.css';
import {SchedulerPage} from './page/demo/sheldulerPage';
import {AllFeatures} from './page/allfeatures';
import {BrowserRouter,
  Routes,
  Route} from 'react-router-dom';
import SignInScreen from './page/authScreen';
import {GraphQlPlayGround} from './components/graphQlPalygroun';

const App=() =>{
  return (
    <>
      <SignInScreen/>
      <GraphQlPlayGround/>
    </>

  // <BrowserRouter>
  //   <Routes>
  //     <Route path="/" element={<AllFeatures />}/>
  //     <Route path="/demo" element={<SchedulerPage />}/>
  //   </Routes>
  // </BrowserRouter>
  );
};

export default App;
