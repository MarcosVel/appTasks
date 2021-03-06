import React, { useRef, useState } from 'react';
import { FlatList, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import TaskList from '../../components/TaskList';
import { COLORS } from '../../utils/colors';
import firebase from '../..//services/firebaseConnection';

export default function TaskView({ user, propKey, setPropKey, tasks, setTasks }) {
  const inputRef = useRef(null);
  const [ newTask, setNewTask ] = useState('');
  
  function handleAdd() {
    // Se vazio fazer nada
    if (newTask === '') {
      return;
    }

    // usuário quer editar uma tarefa
    if (propKey !== '') {
      firebase.database().ref('tarefas').child(user).child(propKey).update({
        nome: newTask // novo valor passado no input de edição
      })
        .then(() => {
          const taskIndex = tasks.findIndex(item => item.key === propKey) // procura o index da task selecionada
          let taskClone = tasks; // clona toda a lista
          taskClone[ taskIndex ].nome = newTask // passa para a task selecionada o valor que está no input

          setTasks([ ...taskClone ]) // faz com que a lista seja atualizada com o novo valor da task
        })

      Keyboard.dismiss();
      setNewTask('');
      setPropKey('');
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
    setPropKey(data.key);
    // coloca no input o dado do card
    setNewTask(data.nome);
    inputRef.current.focus(); // abrir teclado
  }

  function cancelEdit() {
    setPropKey('');
    setNewTask('');
    Keyboard.dismiss();
  }
  
  return (
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

        {
          propKey?.length > 0 && (
            <View style={ styles.viewWarning }>
              <TouchableOpacity style={ styles.btnWarningCancel } onPress={ cancelEdit }>
                <Ionicons name="ios-close-circle-outline" size={ 24 } color={ COLORS.red } style={ { marginRight: 3 } } />
                <Text style={ { color: `${ COLORS.red }` } }>Cancelar</Text>
              </TouchableOpacity>

              <View style={ { flexDirection: 'row', alignItems: 'center', } }>
                <Ionicons name="ios-alert-circle-outline" size={ 24 } color={ COLORS.grey } style={ { marginRight: 3 } } />
                <Text style={ { color: `${ COLORS.grey }` } }>Você está editando uma tarefa</Text>
              </View>
            </View>
          )
        }

        <FlatList
          data={ tasks }
          keyExtractor={ (item) => item.key }
          contentContainerStyle={ { paddingBottom: 100 } }
          showsVerticalScrollIndicator={ false }
          renderItem={ ({ item }) => (
            <TaskList
              data={ item }
              deleteItem={ handleDelete }
              editItem={ handleEdit }
            />
          ) }
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  containerTask: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 20,
  },
  input: {
    flex: 1, // pegar toda largura
    marginBottom: 10,
    backgroundColor: `${ COLORS.white }`,
    borderRadius: 8,
    minHeight: 50,
    maxHeight: 50,
    padding: 10,
    paddingHorizontal: 15,
    elevation: 3,
    fontSize: 17
  },
  buttonAdd: {
    position: 'absolute',
    backgroundColor: `${ COLORS.blue }`,
    maxHeight: 55,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 35,
    bottom: 30,
    right: 5,
    zIndex: 999,
    elevation: 1,
  },
  buttonText: {
    fontSize: 30,
    color: `${ COLORS.white }`,
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
