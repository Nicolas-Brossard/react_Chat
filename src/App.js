import React, { useRef, useState } from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import './App.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: 'AIzaSyAW3jcBSweo9eYw1wpuYpVG_ttzYQxy0IQ',
  authDomain: 'reactchat-4812f.firebaseapp.com',
  databaseURL: 'https://reactchat-4812f.firebaseio.com',
  projectId: 'reactchat-4812f',
  storageBucket: 'reactchat-4812f.appspot.com',
  messagingSenderId: '660678031849',
  appId: '1:660678031849:web:5192af88810be02d97f378',
  measurementId: 'G-DXLTPD3P3V',
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🥰</h1>
        <SignOut />
      </header>
      <section>
        {user ? <Chatroom /> : <Signin />}
      </section>
    </div>
  );
}

function Signin() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  );
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={
      () => auth.signOut()
    }
    >
      Sign Out
    </button>
  );
}

function Chatroom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');
  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div>
        { messages && messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy} />
      </div>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type='submit'>🍺</button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoUrl } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoUrl || `https://media.giphy.com/media/dVugduZC1s2Pq2MV2d/giphy.gif`} />
      <p>
        {text}
      </p>
    </div>
  );
}

export default App;
