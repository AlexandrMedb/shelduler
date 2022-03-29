import React, {useEffect, useState} from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebaseui/dist/firebaseui.css';
import {AllFeatures} from './allfeatures';
import {SchedulePage} from '../page/sheldulePage';

const firebaseConfig = {
  apiKey: 'AIzaSyDuYaUJ8ax3eM0YSP0i0vU0Et7Obdprjr4',
  authDomain: 'shelduler-b5359.firebaseapp.com',
  projectId: 'shelduler-b5359',
  storageBucket: 'shelduler-b5359.appspot.com',
  messagingSenderId: '127252087161',
  appId: '1:127252087161:web:cf3cca93bdd90a70d9afa8',
  measurementId: 'G-K26KZCZ8RG',
};
firebase.initializeApp(firebaseConfig);

const uiConfig = {
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};


export const SignInScreen=()=> {
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver();
    // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  if (!isSignedIn) {
    return (
      <div style={{height: '100vh',
        display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>


    );
  }
  // console.log(firebase.auth().currentUser);
  return (
    <>
      {/* <a onClick={() => firebase.auth().signOut()}>Sign-out</a>*/}
      <SchedulePage/>
    </>
  );
};

