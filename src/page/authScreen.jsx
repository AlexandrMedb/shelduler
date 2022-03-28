import React, {useEffect, useState} from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { initializeApp } from "firebase/app";

// Configure Firebase.
const firebaseConfig = {
    apiKey: "AIzaSyDuYaUJ8ax3eM0YSP0i0vU0Et7Obdprjr4",
    authDomain: "shelduler-b5359.firebaseapp.com",
    projectId: "shelduler-b5359",
    storageBucket: "shelduler-b5359.appspot.com",
    messagingSenderId: "127252087161",
    appId: "1:127252087161:web:cf3cca93bdd90a70d9afa8",
    measurementId: "G-K26KZCZ8RG"
};
firebase.initializeApp(firebaseConfig);

// Configure FirebaseUI.
const uiConfig = {
    signInSuccessUrl: '<url-to-redirect-to-on-success>',
    signInOptions: [
        {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            clientId: 'xxxxxxxxxxxxxxxxx.apps.googleusercontent.com'
        },
        // {
        //     provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        //     requireDisplayName: false
        // }

        // Leave the lines as is for the providers you want to offer your users.
        // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
    ],

    // tosUrl and privacyPolicyUrl accept either url string or a callback
    // function.
    // Terms of service url/callback.
    // tosUrl: '<your-tos-url>',
    // Privacy policy url/callback.
    privacyPolicyUrl: function() {
        window.location.assign('<your-privacy-policy-url>');
    }
};
const app = initializeApp(firebaseConfig);


function SignInScreen() {
    const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

    // Listen to the Firebase Auth state and set the local state.
    useEffect(() => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
            setIsSignedIn(!!user);
        });
        return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
    }, []);

    if (!isSignedIn) {
        return (



            <div style={{height: '100vh',display:"flex", justifyContent:"center", alignItems:"center"}} >
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
            </div>


        );
    }
    console.log(firebase.auth().currentUser)
    return (
        <div>
            <h1>My App</h1>
            <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
            <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
        </div>
    );
}

export default SignInScreen;




//
// var uiConfig = {
//     credentialHelper: firebaseui.auth.CredentialHelper.NONE,
//     callbacks: {
//         signInSuccess: function(currentUser, credential, redirectUrl) {
//             handleSignedInUser(currentUser);
//             // Do not redirect.
//             return false;
//         }
//     },
//     signInOptions: [
//         firebase.auth.EmailAuthProvider.PROVIDER_ID
//     ],
//     tosUrl: '<your-tos-url>'
// };
//
// // Initialize the FirebaseUI Widget using Firebase.
// var ui = new firebaseui.auth.AuthUI(firebase.auth());
// // Keep track of the currently signed in user.
// var currentUid = null;
//
// /**
//  * Displays the UI for a signed in user.
//  * @param {!firebase.User} user
//  */
//
// var handleSignedInUser = function(user) {
//     currentUid = user.uid;
//     document.getElementById('user-signed-in').style.display = 'block';
//     document.getElementById('user-signed-out').style.display = 'none';
//
//     document.getElementById('name').innerHTML = "<b>Display Name:</b>" + user.displayName;
//     document.getElementById('email').innerHTML = "<b>User Email:</b> " + user.email;
//     if (user.photoURL){
//         document.getElementById('photo').src = user.photoURL;
//         document.getElementById('photo').style.display = 'block';
//     } else {
//         document.getElementById('photo').style.display = 'none';
//     }
// };
//
//
// /**
//  * Displays the UI for a signed out user.
//  */
// var handleSignedOutUser = function() {
//     document.getElementById('user-signed-in').style.display = 'none';
//     document.getElementById('user-signed-out').style.display = 'block';
//     ui.start('#firebaseui-container', uiConfig);
// };
//
// // Listen to change in auth state so it displays the correct UI for when
// // the user is signed in or not.
// firebase.auth().onAuthStateChanged(function(user) {
//     // The observer is also triggered when the user's token has expired and is
//     // automatically refreshed. In that case, the user hasn't changed so we should
//     // not update the UI.
//     if (user && user.uid == currentUid) {
//         return;
//     }
//     document.getElementById('loading').style.display = 'none';
//     document.getElementById('loaded').style.display = 'block';
//     user ? handleSignedInUser(user) : handleSignedOutUser();
// });
//
// /**
//  * Deletes the user's account.
//  */
// var deleteAccount = function() {
//     firebase.auth().currentUser.delete().catch(function(error) {
//         if (error.code == 'auth/requires-recent-login') {
//             // The user's credential is too old. She needs to sign in again.
//             firebase.auth().signOut().then(function() {
//                 // The timeout allows the message to be displayed after the UI has
//                 // changed to the signed out state.
//                 setTimeout(function() {
//                     alert('Please sign in again to delete your account.');
//                 }, 1);
//             });
//         }
//     });
// };
//
//
// /**
//  * Initializes the app.
//  */
// var initApp = function() {
//     document.getElementById('sign-out').addEventListener('click', function() {
//         firebase.auth().signOut();
//     });
//     document.getElementById('delete-account').addEventListener(
//         'click', function() {
//             deleteAccount();
//         });
// };
//
// window.addEventListener('load', initApp);