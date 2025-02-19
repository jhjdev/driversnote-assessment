import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  title: string;
  subtitle: string;
  onPress: () => void;
};

export const Row = (props: Props) => (
  <TouchableOpacity onPress={props.onPress} style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.subtitle}>{props.subtitle}</Text>
    </View>
    <View style={styles.right}></View>
  </TouchableOpacity>
);

export const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  content: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3a3a3a',
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
    marginTop: 2,
  },
  separator: {
    backgroundColor: '#ececec',
    height: 1,
  },
  right: {
    alignItems: 'flex-end',
    flex: 1,
  },
});
