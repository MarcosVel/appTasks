import React, { useState } from 'react'
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import firebase from '../../services/firebaseConnection';

export default function Login({ changeStatus }) {
  const [ type, setType ] = useState('login');

  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  function handleLogin() {
    // login
    if (type === 'login') {
      const user = firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
          // console.log(user.user)
          changeStatus(user?.user.uid)
        })
        .catch((error) => {
          console.error(error)
          alert('Ops, ocorreu algum erro 😵')
          return;
        })
    } else {
      // Cadastro de usuário
      const user = firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
          // console.log(user.user)
          changeStatus(user.user.uid)
        })
        .catch((error) => {
          console.log(error)
          alert('Ops, erro ao cadastrar 😵')
          return;
        })
    }
  }

  return (
    <TouchableWithoutFeedback onPress={ () => Keyboard.dismiss() }>
      <View style={ styles.container }>
        <TextInput
          placeholder='Seu e-mail'
          style={ styles.input }
          autoCorrect={ false }
          autoCapitalize='none'
          autoComplete='email'
          value={ email }
          onChangeText={ (email) => setEmail(email) }
        />

        <TextInput
          placeholder='******'
          style={ styles.input }
          value={ password }
          onChangeText={ (senha) => setPassword(senha) }
        />

        <TouchableOpacity
          style={ [ styles.btnLogin, { backgroundColor: type === 'login' ? '#3ea6f2' : '#141414' } ] }
          onPress={ handleLogin }
        >
          <Text style={ styles.loginText }>
            {
              type === 'login' ? 'Acessar' : 'Cadastrar'
            }
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={ () => setType(type => type === 'login' ? 'cadastrar' : 'login') }>
          <Text>
            { type === 'login' ? 'Criar uma conta' : 'Fazer login' }
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 45,
    width: '90%',
    padding: 10,
    elevation: 1,
    fontSize: 17
  },
  btnLogin: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    width: '90%',
    borderRadius: 8,
    marginBottom: 10
  },
  loginText: {
    fontSize: 17,
    color: '#fff',
  }
})
