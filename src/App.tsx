import React, {useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  DefaultOptions,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {createUploadLink} from 'apollo-upload-client';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebaseui/dist/firebaseui.css';
import {SchedulePage} from './page/sheldulePage';
import {connect} from 'react-redux';
import {RootState} from './store/store';
import {setUid} from './reducer/userReducer';
import {Box, CircularProgress} from '@mui/material';

const API_URL = '/graphql';


const firebaseConfig = {
  apiKey: 'AIzaSyB3bZ7aOfsYSC9lbyXascqSjEl5hggR-w8',
  authDomain: 'rooms-2e40e.firebaseapp.com',
  projectId: 'rooms-2e40e',
  storageBucket: 'rooms-2e40e.appspot.com',
  messagingSenderId: '578883404267',
  appId: '1:578883404267:web:060e6d869a26dbc25d19ae',
  measurementId: 'G-CZ3REN2VER',
};
firebase.initializeApp(firebaseConfig);

const uiConfig = {
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      disableSignUp: {status: true},
    },
  ],
};


const mapStateToProps =({}:RootState)=>({});

interface props{
  setUid:(data:string)=>void
}

const App=connect(mapStateToProps, {setUid})((props:props)=>{
  const {setUid}=props;
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
  const [loading, setLoading] =useState(true);


  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      setIsSignedIn(!!user);
      setLoading(false);
      if (user?.uid) {
        setUid(user?.uid);
      }
    });
    return () => unregisterAuthObserver();
    // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  if (loading && !isSignedIn) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'}}>
        <CircularProgress />
      </Box>);
  }

  if (!isSignedIn) {
    return (
      <div style={{height: '100vh',
        display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
    );
  }


  const httpLink = createUploadLink({
    uri: API_URL,
  });


  console.log(firebase.auth().currentUser?.uid);

  const authLink = setContext(async (_, {headers}) => {
    const token = await firebase.auth()?.currentUser?.getIdToken();

    return {
      headers: {
        ...headers,
        'apimaker-token': token,
        'apimaker-allowed-role': 'admin',
      },
    };
  });

  const defaultOptions:DefaultOptions = {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  };

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      addTypename: false,
    }),
    defaultOptions: defaultOptions,
  });

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <SchedulePage/>
      </BrowserRouter>
    </ApolloProvider>

  );
});

export default App;
