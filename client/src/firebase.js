import firebase from 'firebase'
var config = {
  apiKey: 'AIzaSyC8lr-W7i7fBN8rZtq-ZmuKK_b6wCyyxfg',
  authDomain: 'testest-2bce5.firebaseapp.com',
  databaseURL: 'https://testest-2bce5.firebaseio.com',
  projectId: 'testest-2bce5',
  storageBucket: 'testest-2bce5.appspot.com',
  messagingSenderId: '930833629790'
}

export const app = firebase.initializeApp(config)
