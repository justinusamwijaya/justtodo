import firebase from 'firebase'
var config = {
  apiKey: 'AIzaSyBggkaoeSgsd2zH_1cpwGZx90-x37R6zSE',
  authDomain: 'todolist-31146.firebaseapp.com',
  databaseURL: 'https://todolist-31146.firebaseio.com',
  projectId: 'todolist-31146',
  storageBucket: 'todolist-31146.appspot.com',
  messagingSenderId: '533162468137'
}

export const app = firebase.initializeApp(config)
