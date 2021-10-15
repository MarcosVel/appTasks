import React from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import TaskList from '../../components/TaskList';

export default function TaskView({novaTask, inputRef, handleAdd, key, cancelEdit, tasks, deleteItem, editItem,}) {
  return (
    <>
      <View style={ styles.containerTask }>
        <TextInput
          style={ styles.input }
          placeholder="Tarefa..."
          value={ novaTask }
          onChangeText={ (text) => setNewTask(text) }
          ref={ inputRef }
        />

        <TouchableOpacity style={ styles.buttonAdd } onPress={ handleAdd }>
          <FontAwesome name="plus" size={ 20 } color="white" />
        </TouchableOpacity>
      </View>

      {
        key?.length > 0 && (
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
            deleteItem={ deleteItem }
            editItem={ editItem }
          />
        ) }
      />
    </>
  )
}

const styles = StyleSheet.create({
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
