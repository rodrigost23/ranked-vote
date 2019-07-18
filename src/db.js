import Vue from 'vue';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { firestorePlugin } from 'vuefire';

Vue.use(firestorePlugin);

firebase.initializeApp({
    projectId: 'ranked-vote',
    // databaseURL: 'YOUR_DB_URL'
});
export const db = firebase.firestore()

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
// const { TimeStamp, GeoPoint } = firebase.firestore
// export { TimeStamp, GeoPoint }