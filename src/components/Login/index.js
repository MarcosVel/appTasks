import React, { useState } from 'react'
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'

export default function Login() {
  const [ type, setType ] = useState('login');

  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  function handleLogin() {
    alert('teste')
  }

  return (
    <TouchableWithoutFeedback onPress={ () => Keyboard.dismiss() }>
      <View style={ styles.container }>
        <TextInput
          placeholder='Seu e-mail'
          style={ styles.input }
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
          style={ styles.btnLogin }
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
    backgroundColor: '#141414',
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
