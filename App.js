import React, { useEffect, useState } from 'react';
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

  function handleDelete(key) {
    // console.log(key);
    firebase.database().ref('tarefas').child(user).child(key).remove()
      .then(() => {
        const findTasks = tasks.filter(item => item.key !== key) // percorre toda lista e retorna os que não tem o id selecionado
        setTasks(findTasks);
      })
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

        // para pegar as tarefas que já foram adicionadas e acrescentar a nova
        setTasks(oldTask => [ ...oldTask, data ])

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
              contentContainerStyle={ { paddingBottom: 50 } }
              showsVerticalScrollIndicator={ false }
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
