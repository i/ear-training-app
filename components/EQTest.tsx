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

  const [score, setScore] = React.useState(0);
  const [lives, setLives] = React.useState(3);

  const showTestItem = function() {
    if (testItems.length === 0) { return; }
    setTestItem(testItems[testItemIdx]);
  }

  React.useEffect(getTest, []);
  React.useEffect(showTestItem, [testItems, testItemIdx]);



  const makeGuess = function(guessedFrequency: number) {
    console.log('you guessed', guessedFrequency);
    const perfectTolerance = testItem.perfect_tolerance * testItem.boosted_frequency;
    const perfectMin = testItem.boosted_frequency - perfectTolerance;
    const perfectMax = testItem.boosted_frequency + perfectTolerance;

    const okTolerance = testItem.tolerance * testItem.boosted_frequency;
    const okMin = testItem.boosted_frequency - okTolerance;
    const okMax = testItem.boosted_frequency + okTolerance;

    if (guessedFrequency > perfectMin && guessedFrequency < perfectMax) {
      alert('perfect');
      setScore(score+5);
    } else if (guessedFrequency > okMin && guessedFrequency < okMax) {
      setScore(score+1);
      alert('good');
    } else {
      setLives(lives-1);
      alert('no good');
    }

    setTestItemIdx(testItemIdx+1);
  }

  //const player = // React.useMemo(() =>
    //React.createElement(MultiAudioPlayer, {uris: getUris(testItem)}) // , [testItem]);
  //

  if (lives < 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>YOU DEAD</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Score: {score}</Text>
      <Text style={styles.title}>Lives: {lives}</Text>
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

function getUris(testItem: any) {
  if (!testItem) {
    return [];
  }

  return [
    testItem['original_audio_url'],
    testItem['processed_audio_url'],
  ];
}
