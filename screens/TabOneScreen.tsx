import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';


function AudioPlayer(props) {
  var playingIndex = 0;
  const playing = false;
  const sounds: Audio.Sound[] = [];

  const uris = props.uris;


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
  const [uris, setUris] = useState([]);

  const getUris = async() => {
    const api = new Api('http://localhost:8080');
    const json = await api.getAudios();
    setUris(json.audios.map((a) => { return "http://localhost:8080/audio/" + a.ID }));
  };


  useEffect(() => {
    getUris();
  }, []);

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
