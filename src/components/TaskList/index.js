import React from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { RectButton, Swipeable } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons';

export default function TaskList({ data, deleteItem, editItem }) {
  return (
    <Swipeable
      overshootRight={ true }
      renderRightActions={ () => (
        <Animated.View style={ { justifyContent: 'center' } }>
          <RectButton
            style={ styles.buttonRemove }
            onPress={ () => deleteItem(data.key) }
          >
            <Feather name="trash-2" size={ 24 } color="#f5f5f5" />
          </RectButton>
        </Animated.View>
      ) }
    >
      <RectButton
        style={ styles.container }
        onPress={ () => editItem(data) }
      >
        <Text>{ data.nome }</Text>
      </RectButton>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: 40,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  buttonRemove: {
    width: 35,
    height: 35,
    backgroundColor: '#ff0000',
    marginTop: -10, // compensar o marginBottom do container
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    // right: 20,
    // paddingLeft: 15
  }

})
