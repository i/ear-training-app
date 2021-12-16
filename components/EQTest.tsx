import * as React from 'react';
import { Button, StyleSheet, TextInput } from 'react-native';
import { Text, View } from '../components/Themed';

import { MultiAudioPlayer } from '../components/AudioPlayer';
import { Api } from '../api/api';

export function EQTest() {
  const [text, onChangeText] = React.useState('Enter frequency');
  const [number, onChangeNumber] = React.useState(null);
  const [uris, setUris] = React.useState([]);
  const [testItems, setTestItems] = React.useState([]);
  const [testItemIdx, setTestItemIdx] = React.useState(0);

  const api = new Api('http://localhost:8080');

  const getTest = async function() {
    const test = await api.getTest();
    setTestItems(test.items);
  };

  const showTestItem = function() {
    if (testItems.length === 0) { return; }
    const currentItem = testItems[testItemIdx];
    const newUris = [
      currentItem['original_audio_url'],
      currentItem['processed_audio_url'],
    ]
    setUris(newUris)
  }

  React.useEffect(getTest, []);
  React.useEffect(showTestItem, [testItems])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter the boosted frequency!</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <MultiAudioPlayer uris={uris} />
      <TextInput value={text}  onChangeText={onChangeText} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
