import React, { useEffect, useState } from 'react';
import { Keyboard, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import Login from './src/components/Login';
import TaskView from './src/pages/TaskView';
import firebase from './src/services/firebaseConnection';

export default function App() {
  const [ user, setUser ] = useState(null);
  const [ tasks, setTasks ] = useState([]);

  const [ key, setKey ] = useState('');

  useEffect(() => {
    function getUser() {
      // sem user, fazer nada
      if (!user) {
        return;
      }

      firebase.database().ref('tarefas').child(user).once('value', (snapshot) => {
        // começar vazia
        setTasks([]);

        // percorrer e preencher lista
        snapshot?.forEach((childItem) => {
          let data = {
            key: childItem.key,
            nome: childItem.val().nome
          }

          setTasks(oldTask => [ ...oldTask, data ])
        })
      })
    }

    // chamar para ser executada
    getUser();
  }, [ user ])

  return (
    <SafeAreaView style={ styles.container }>
      <StatusBar backgroundColor="transparent" barStyle='dark-content' />
      {
        !user ?
          // Create/Login view
          <Login changeStatus={ (user) => setUser(user) } />
          :
          <TaskView user={ user } propKey={ key } setPropKey={ setKey } tasks={ tasks } setTasks={ setTasks } />
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6fc',
    paddingHorizontal: 10,
  },
});
