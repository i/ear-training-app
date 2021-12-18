import { Audio, AVPlaybackStatusToSet, AVPlaybackStatus } from 'expo-av';
import * as React from 'react';
import { StyleSheet, Button, Text, TextInput } from 'react-native';
import { View } from '../components/Themed';

export function MultiAudioPlayer({ uris }) {
  console.log('rerendering');


  const [loading, setLoading] = React.useState(false);

  function reducer(state, action) {
    switch (action.type) {
      case 'replaceUris':
        if (loading || action.uris.length === 0) {
          return state;
        }

        if (arraysAreEqual(state.uris, action.uris)) {
          return state;
        }

        setLoading(true);
        unloadAll(state.sounds);
        playAllSounds(action.uris);
        return { uris: action.uris };

      case 'play':
        startAllSounds(state.sounds)
        toggleMutes(state.sounds, action.index);
        return state;

      case 'setButtonsAndSounds':
        setLoading(false);
        return { ...state, buttons: action.buttons, sounds: action.sounds };
    }
  }

  function unloadAll(sounds: Array<Audio.Sound>) {
    for (var i = 0; i < sounds.length; i++) {
      sounds[i].unloadAsync();
    }
  }

  const [state, dispatch] =  React.useReducer(reducer, {
    uris: [],
    buttons: [],
    sounds: [],
  });

  React.useEffect(() => {
    dispatch({type: 'replaceUris', uris: uris});
  }, [uris]);



  function toggleMutes(sounds: Array<Audio.Sound>, soundIdx: number) {
    for (var i = 0; i < sounds.length; i++) {
      var sound = sounds[i];
      try {
        //sound.setIsMutedAsync(i != soundIdx);
        const vol = i == soundIdx ? 1.0 : 0.0;
        //const vol = 0;
        console.log('setting', i, 'volume to:', vol);
        sound.setVolumeAsync(vol);
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function startAllSounds(sounds: Array<Audio.Sound>) {
    for (var i = 0; i < sounds.length; i++) {
      const status: AVPlaybackStatus = await sounds[i].getStatusAsync();
      if (!status.isPlaying)  sounds[i].playAsync();
    }
  };

  const initialStatus = {
    shouldPlay: true,
    rate: 1.0,
    shouldCorrectPitch: false,
    volume: 1.0,
    isMuted: false,
    isLooping: true,
  };

  async function playAllSounds(uris: Array<string>) {
    console.log('playing sounds: ', uris);
    const sounds: Array<Audio.Sound> = [];
    const buttons = [];

    for (var i = 0; i < uris.length; i++) {
      const source = { uri: uris[i] };
      const sound = new Audio.Sound();
      //await sound.loadAsync(source, { ...initialStatus, volume: 1 }, false);
      await sound.loadAsync(source, { ...initialStatus, volume: i == 0 ? 1 : 0 }, false);
      sounds.push(sound);

      const title = "PLAY " + i;
      const key = `audio_${i}`;
      const idx = i;

      buttons.push(<Button key={key} onPress={() => dispatch({type: 'play', index: idx})} title={title}/>);
    }

    dispatch({type: 'setButtonsAndSounds', buttons, sounds});
  }

  if (loading) {
    return (<Text>Loading...</Text>);
  }


  return (
    <View>
      <Button onPress={() => dispatch({type: 'play', index: 0})} title="Play" />
      <Text>This is a crock of crap {state.buttons.length}</Text>
      {state.buttons}
    </View>
  );
}


function arraysAreEqual(a: Array<any>, b: Array<any>) {
  if (a.length !== b.length) {
    return false;
  }
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
