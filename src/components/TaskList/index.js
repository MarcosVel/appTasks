import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function TaksList({ data }) {
  return (
    <View>
      <Text>{ data.nome }</Text>
    </View>
  )
}

const styles = StyleSheet.create({})
