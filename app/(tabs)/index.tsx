import { registerRootComponent } from 'expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';


import App from './App';

registerRootComponent(App);


export default function HomeScreen() {
    const [selected, setSelected] = React.useState("");

  const data = [
   { key: '1', value: 'Air France' },
    { key: '2', value: 'British Airways' },
    { key: '3', value: 'Cathay Pacific' },
    { key: '4', value: 'Emirates' },
    { key: '5', value: 'Etihad Airways' },
    { key: '6', value: 'Lufthansa' },
    { key: '7', value: 'Qatar Airways' },
    { key: '8', value: 'Singapore Airlines' },
    { key: '9', value: 'Swiss Intl Air Lines' },
    { key: '10', value: 'Turkish Airlines' },
  ];

  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Seleccionado: {selected || 'Ninguno'}
      </Text>
      <SelectList
        setSelected={(val: string) => setSelected(val)}
        data={data}
        save="value"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
