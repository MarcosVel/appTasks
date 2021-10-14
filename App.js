import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, StatusBar, SafeAreaView, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import Login from './src/components/Login';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import TaskList from './src/components/TaskList';

import firebase from './src/services/firebaseConnection';

export default function App() {
  const [ user, setUser ] = useState(null);
  const [ tasks, setTasks ] = useState([]);

  const [ newTask, setNewTask ] = useState('');
  const [ key, setKey ] = useState('');

  const inputRef = useRef(null);

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
    // console.log('Item clicado:', data)
    setKey(data.key);
    // coloca no input o dado do card
    setNewTask(data.nome);
    inputRef.current.focus(); // abrir teclado

  }

  function handleAdd() {
    // Se vazio fazer nada
    if (newTask === '') {
      return;
    }

    // usuário quer editar uma tarefa
    if (key !== '') {
      firebase.database().ref('tarefas').child(user).child(key).update({
        nome: newTask // novo valor passado no input de edição
      })
        .then(() => {
          const taskIndex = tasks.findIndex(item => item.key === key) // procura o index da task selecionada
          let taskClone = tasks; // clona toda a lista
          taskClone[ taskIndex ].nome = newTask // passa para a task selecionada o valor que está no input

          setTasks([ ...taskClone ]) // faz com que a lista seja atualizada com o novo valor da task
        })

      Keyboard.dismiss();
      setNewTask('');
      setKey('');
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

  function cancelEdit() {
    setKey('');
    setNewTask('');
    Keyboard.dismiss();
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
                ref={ inputRef }
              />

              <TouchableOpacity style={ styles.buttonAdd } onPress={ handleAdd }>
                <FontAwesome name="plus" size={ 20 } color="white" />
              </TouchableOpacity>
            </View>

            {
              key.length > 0 && (
                <View style={ styles.viewWarning }>
                  <TouchableOpacity style={ styles.btnWarningCancel } onPress={ cancelEdit }>
                    <Ionicons name="ios-close-circle-outline" size={ 24 } color="#ff0000" style={ { marginRight: 3 } } />
                    <Text style={ { color: '#ff0000' } }>Cancelar</Text>
                  </TouchableOpacity>

                  <View style={ { flexDirection: 'row', alignItems: 'center', } }>
                    <Ionicons name="ios-alert-circle-outline" size={ 24 } color="#9c9c9c" style={ { marginRight: 3 } } />
                    <Text style={ { color: '#9c9c9c' } }>Você está editando uma tarefa</Text>
                  </View>
                </View>
              )
            }

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
    paddingHorizontal: 15,
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
  },
  viewWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  btnWarningCancel: {
    flexDirection: 'row', alignItems: 'center'
  },
});
