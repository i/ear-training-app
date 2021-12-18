import * as React from 'react';
import { Button, StyleSheet, TextInput } from 'react-native';
import { Text, View } from '../components/Themed';

import { MultiAudioPlayer } from '../components/AudioPlayer';
import { FrequencySlider } from '../components/FrequencySlider';
import Toast from 'react-native-root-toast';
import { Api } from '../api/api';

export function EQTest() {
  const [number, onChangeNumber] = React.useState(null);
  const [testItems, setTestItems] = React.useState([]);
  const [testItem, setTestItem] = React.useState(null);
  const [testItemIdx, setTestItemIdx] = React.useState(0);

  const api = new Api('http://10.21.21.8:8080');

  const getTest = function() {
    const test = api.getTest().then((test) => { setTestItems(test.items); });
  };

  const showTestItem = function() {
    if (testItems.length === 0) { return; }
    setTestItem(testItems[testItemIdx]);
  }

  React.useEffect(getTest, []);
  React.useEffect(showTestItem, [testItems, testItemIdx]);



  const makeGuess = function(guessedFrequency: number) {
    const perfectTolerance = testItem.perfect_tolerance * testItem.boosted_frequency;
    const perfectMin = testItem.boosted_frequency - perfectTolerance;
    const perfectMax = testItem.boosted_frequency + perfectTolerance;

    const okTolerance = testItem.tolerance * testItem.boosted_frequency;
    const okMin = testItem.boosted_frequency - okTolerance;
    const okMax = testItem.boosted_frequency + okTolerance;

    if (guessedFrequency > perfectMin && guessedFrequency < perfectMax) {
      alert('perfect');
    } else if (guessedFrequency > okMin && guessedFrequency < okMax) {
      alert('good');
    } else {
      alert('no good');
    }

    setTestItemIdx(testItemIdx+1);
  }

  //const player = // React.useMemo(() =>
    //React.createElement(MultiAudioPlayer, {uris: getUris(testItem)}) // , [testItem]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test item index: {testItemIdx}</Text>
      <Text style={styles.title}>Enter the boosted frequency!</Text>
      <MultiAudioPlayer uris={getUris(testItem)} />

      <FrequencySlider onSlidingComplete={makeGuess} />

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
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
  slider: {
    width: 200,
    height: 1,
  },
});

function getUris(testItem) {
  if (!testItem) {
    return [];
  }

  //return [
    //'http://localhost:8080/audio/544713f2-57a0-4a48-bd19-b74ff8ba477f/download.mp3',
    //'http://localhost:8080/audio/32c9ccef-f24a-4878-b06d-d6511b5ca78d/download.mp3',
  //];

  return [
    testItem['original_audio_url'],
    testItem['processed_audio_url'],
  ];
}
