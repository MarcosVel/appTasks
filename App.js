import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import Login from './src/components/Login';
import { FontAwesome } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import TaskList from './src/components/TaskList';

let tasks = [
  { key: '1', nome: 'Comprar uma puta' },
  { key: '2', nome: 'Dar um carregador pra kenga' }
]

export default function App() {
  const [ user, setUser ] = useState(null);

  const [ newTask, setNewTask ] = useState('');

  function handleDelete(key) {
    // console.log(key);

  }

  function handleEdit(data) {
    console.log('Item clicado:', data)
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

              <TouchableOpacity style={ styles.buttonAdd }>
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
