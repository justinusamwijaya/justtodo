import firebase from 'firebase'
var config = {
  apiKey: 'AIzaSyACppItbWOUttdCVSBCr0_8X3sipYSWYx8',
  authDomain: 'employee-cb439.firebaseapp.com',
  databaseURL: 'https://employee-cb439.firebaseio.com',
  projectId: 'employee-cb439',
  storageBucket: 'employee-cb439.appspot.com',
  messagingSenderId: '306456203046'
}

export const app = firebase.initializeApp(config)
