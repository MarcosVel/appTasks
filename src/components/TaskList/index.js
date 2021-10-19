import React from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { RectButton, Swipeable } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../utils/colors';

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
            <Feather name="trash-2" size={ 24 } color={ COLORS.white } />
          </RectButton>
        </Animated.View>
      ) }
    >
      <RectButton
        style={ styles.container }
        onPress={ () => editItem(data) }
      >
        <Text style={ { fontSize: 16 } }>{ data.nome }</Text>
      </RectButton>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 50,
    flexDirection: 'row',
    backgroundColor: `${ COLORS.white }`,
    alignItems: 'center',
    marginTop: 1,
    marginHorizontal: 2,
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  buttonRemove: {
    width: 45,
    height: '70%',
    backgroundColor: `${ COLORS.red }`,
    marginTop: -9, // compensar o marginBottom do container
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    // right: 5,
    // paddingLeft: 15
  }

})
