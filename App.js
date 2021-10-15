import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, StatusBar, SafeAreaView, TextInput, TouchableOpacity, Keyboard, FlatList } from 'react-native';
import Login from './src/components/Login';
// import { FontAwesome, Ionicons } from '@expo/vector-icons';
// import TaskList from './src/components/TaskList';
import firebase from './src/services/firebaseConnection';
import TaskView from './src/pages/TaskView';

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
          <TaskView novaTask={ newTask } inputRef={ inputRef } handleAdd={ handleAdd } key={ key } cancelEdit={ cancelEdit } tasks={ tasks } deleteItem={ handleDelete } editItem={ handleEdit } />
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
