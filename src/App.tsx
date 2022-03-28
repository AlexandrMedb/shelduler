import React from 'react';
import './App.css';
import {SchedulerPage} from "./page/sheldulerPage";
import {AllFeatures} from "./page/allfeatures";
import { BrowserRouter,
    Routes,
    Route,} from "react-router-dom";
import SignInScreen from "./page/authScreen";

function App() {
  return (
      <SignInScreen/>
      // <BrowserRouter>
      //   <Routes>
      //     <Route path="/" element={<AllFeatures />}/>
      //     <Route path="/demo" element={<SchedulerPage />}/>
      //   </Routes>
      // </BrowserRouter>
  );
}

export default App;
