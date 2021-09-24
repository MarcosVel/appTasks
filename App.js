import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, SafeAreaView, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import Login from './src/components/Login';
import { FontAwesome } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import TaskList from './src/components/TaskList';

import firebase from './src/services/firebaseConnection';

export default function App() {
  const [ user, setUser ] = useState(null);
  const [ tasks, setTasks ] = useState([]);

  const [ newTask, setNewTask ] = useState('');

  function handleDelete(key) {
    // console.log(key);

  }

  function handleEdit(data) {
    console.log('Item clicado:', data)
  }

  function handleAdd() {
    // Se vazio fazer nada
    if (newTask === '') {
      return;
    }

    // salvando tarefas no id do usuário
    let tarefas = firebase.database().ref('tarefas').child(user);
    let chave = tarefas.push().key;

    tarefas.child(chave).set({
      nome: newTask
    })
      .then(() => {
        const data = {
          key: chave,
          nome: newTask,
        };

        // para pegar as tarefas que já foram adicionadas e acrescentar a nova / ordem inversa
        setTasks(oldTask => [ ...oldTask, data ].reverse())

        Keyboard.dismiss();
        setNewTask('');
      })
  }

  return (
    <SafeAreaView style={ styles.container }>
      <StatusBar backgroundColor="transparent" barStyle='dark-content' />
      {
        !user ?
          // Create/Login view
          <Login changeStatus={ (user) => setUser(user) } />

          :

          // Task View
          <>
            <View style={ styles.containerTask }>
              <TextInput
                style={ styles.input }
                placeholder="Tarefa..."
                value={ newTask }
                onChangeText={ (text) => setNewTask(text) }
              />

              <TouchableOpacity style={ styles.buttonAdd } onPress={ handleAdd }>
                <FontAwesome name="plus" size={ 20 } color="white" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={ tasks }
              keyExtractor={ (item) => item.key }
              renderItem={ ({ item }) => (
                <TaskList
                  data={ item }
                  deleteItem={ handleDelete }
                  editItem={ handleEdit }
                />
              ) }
            />
          </>
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

  containerTask: {
    flexDirection: 'row',
    paddingTop: 20,
  },
  input: {
    flex: 1, // pegar toda largura
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 45,
    padding: 10,
    elevation: 3,
    fontSize: 17
  },
  buttonAdd: {
    backgroundColor: '#141414',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 30,
    color: '#fff',
  }
});
