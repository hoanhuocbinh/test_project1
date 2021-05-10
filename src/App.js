import React from 'react';
import logo from './logo.svg';
import './App.css';
// need to install "npm install --save aws-amplify @aws-amplify/ui-react"
import Amplify from 'aws-amplify';      // code need to add for auth
import awsconfig from './aws-exports';  // code need to add for auth
import { AmplifySignOut,withAuthenticator } from '@aws-amplify/ui-react';   // code need to add for auth

Amplify.configure(awsconfig)  // code need to add for auth

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* code need to add for auth */}
        {/* AmplifySignOut a sign out button, move it to where we want */} 
        <h2> My test amplify App content</h2>
        <AmplifySignOut />      
      </header>
    </div>
  );
}

export default withAuthenticator(App);    // code need to modify for auth
