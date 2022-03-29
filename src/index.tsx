import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from 'react-router-dom';
import {createUploadLink} from 'apollo-upload-client';
import {Provider} from 'react-redux';
import {store} from './store/store';

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  DefaultOptions,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';

const API_URL = '/graphql';

const httpLink = createUploadLink({
  uri: API_URL,
});

console.log(process.env.REACT_APP_API_KEY);
console.log(process.env.REACT_APP_API_ROLE);


const authLink = setContext((_, {headers}) => {
  const params = new URL(window.location.href).searchParams;
  const token = params.get('token');

  return {
    headers: {
      ...headers,
      'apimaker-secret': process.env.REACT_APP_API_KEY,
      'apimaker-allowed-role': process.env.REACT_APP_API_ROLE,
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

ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <ApolloProvider client={client}>
          <Provider store={store}>
            <App />
          </Provider>
        </ApolloProvider>{' '}
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root'),
);


serviceWorker.unregister();
