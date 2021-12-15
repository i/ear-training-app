import * as React from 'react';
import { StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';


function AudioPlayer(ctx) {
  var playingIndex = 0;
  const playing = false;
  const sounds: Audio.Sound[] = [];

  const uris = ctx.uris;


  console.log(uris);
  const initialStatus = {
    shouldPlay: false,
    rate: 1.0,
    shouldCorrectPitch: false,
    volume: 1.0,
    isMuted: false,
    isLooping: true,
  };


  const makePlay = function(idx: number) {
    return function() {
      sounds[playingIndex].stopAsync();
      sounds[idx].playAsync();
      playingIndex = idx;
    };
  }

  const parts = [];

  for (var i = 0; i < uris.length; i++) {
    const source = { uri: uris[i] };

    try {
      sounds[i] = new Audio.Sound();
      sounds[i].loadAsync(
        source,
        initialStatus,
        false
      );

      const title = "BUTTON " + i;

      parts.push(<Button onPress={makePlay(i)} title={title}/>);
    } catch (error) {
      console.log(`An error occurred: ${error}`);
    }
  }



  return parts;
}

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const uris = [
    'https://2d2b-98-174-90-59.ngrok.io/audio/9a424deb-c063-41a4-8277-bfe64c97fc0f-eq-200.mp3',
    'https://2d2b-98-174-90-59.ngrok.io/audio/9a424deb-c063-41a4-8277-bfe64c97fc0f-eq-350.mp3',
    'https://2d2b-98-174-90-59.ngrok.io/audio/9a424deb-c063-41a4-8277-bfe64c97fc0f-eq-500.mp3',
    'https://2d2b-98-174-90-59.ngrok.io/audio/9a424deb-c063-41a4-8277-bfe64c97fc0f-eq-8000.mp3'
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EQ Test</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <AudioPlayer uris={uris}/>
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}


class TestItem {
  uri: string;
  name: string;

  constructor(name: string, uri: string) {
    this.name = name;
    this.uri = uri;
  }
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
