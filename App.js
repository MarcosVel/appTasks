import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, SafeAreaView } from 'react-native';
import Login from './src/components/Login';

export default function App() {
  const [ user, setUser ] = useState(null);

  return (
    <SafeAreaView style={ styles.container }>
      <StatusBar backgroundColor="transparent" barStyle='dark-content' />
      {
        !user ?
          <Login />
          :
          <Text>Dentro da tela Tarefas</Text>
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
