import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';

const App = () => {
  const [selected, setSelected] = React.useState<string>("");

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

  const imgMap = React.useMemo(() => {
  const images = [
    { key: 'Air France',               src: require('../../assets/images/air-france.png') },
    { key: 'British Airways',          src: require('../../assets/images/british-airways.png') },
    { key: 'Cathay Pacific',           src: require('../../assets/images/cathay-pacific.png') },
    { key: 'Emirates',                 src: require('../../assets/images/emirates.png') },
    { key: 'Etihad Airways',           src: require('../../assets/images/etihad-airways.png') },
    { key: 'Lufthansa',                src: require('../../assets/images/lufthansa.png') },
    { key: 'Qatar Airways',            src: require('../../assets/images/qatar-airways.png') },
    { key: 'Singapore Airlines',       src: require('../../assets/images/singapore-airlines.png') },
    { key: 'Swiss Intl Air Lines',     src: require('../../assets/images/swiss-international.png') },
    { key: 'Turkish Airlines',         src: require('../../assets/images/turkish-airlines.png') },
  ];
  return Object.fromEntries(images.map(i => [i.key, i.src]));
}, []);


  const selectedImg = selected ? imgMap[selected] : undefined;

  return (
    <View style={styles.container}>
        <View style={styles.row}>
        <Text style={styles.title}>
            Aerolínea seleccionada: {selected || 'Ninguna'}
        </Text>

        {selectedImg && (
            <Image source={selectedImg} style={styles.logoInline} resizeMode="contain" />
        )}
        </View>

        <View style={styles.row}>
        <SelectList
            data={data}
            save="value"
            setSelected={(val: string) => setSelected(val)}
            placeholder="Elige una aerolínea"
            searchPlaceholder="Buscar..."
            boxStyles={styles.box}
            dropdownStyles={styles.dropdown}
        />
        </View>
    </View>
    );

};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',       // 🔹 Coloca los elementos en fila
    alignItems: 'center',       // 🔹 Centra verticalmente
    justifyContent: 'space-between', // opcional, separa los elementos
    gap: 10,                    // 🔹 Añade un pequeño espacio entre ellos (React Native 0.71+)
  },
  logoInline: {
    width: 90,
    height: 60,
  },
  box: {
    borderRadius: 12,
    flex: 1,                    // 🔹 Permite que el dropdown use el espacio restante
  },
  dropdown: {
    borderRadius: 12,
    marginTop: 8,
  },
});


export default App;
