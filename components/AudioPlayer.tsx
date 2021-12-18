import { Audio, AVPlaybackStatusToSet, AVPlaybackStatus } from 'expo-av';
import * as React from 'react';
import { StyleSheet, Button, Text, TextInput } from 'react-native';
import { View } from '../components/Themed';

export function MultiAudioPlayer({ uris }) {
  const [loading, setLoading] = React.useState(false);

  const initialState = {
    uris: [],
    buttons: [],
    sounds: [],
    activeIndex: 0,
  };

  function reset(state) {
    console.log('resetting state...');
    return state;
  }

  const [state, dispatch] =  React.useReducer(reducer, initialState, reset);

  console.log('rerendering');
  console.log(state);



  function reducer(state, action) {
    switch (action.type) {
      case 'replaceUris':
        if (loading || action.uris.length === 0) {
          return state;
        }

        if (arraysAreEqual(state.uris, action.uris)) {
          return state;
        }

        console.log(state);
        setLoading(true);
        unloadAll(state.sounds);
        playAllSounds(action.uris);
        return { ...state, uris: action.uris, activeIndex: 0 };

      case 'play':
        startAllSounds(state.sounds)
        toggleMutes(state.sounds, action.index);
        //toggleButtons(state.buttons, action.index);
        return { ...state, activeIndex: action.index };

      case 'setSounds':
        setLoading(false);
        return { ...state,  uris: action.uris, sounds: action.sounds };

      default:
        throw(`invalid action type: ${action.type}`);
    }
  }

  function unloadAll(sounds: Array<Audio.Sound>) {
    for (var i = 0; i < sounds.length; i++) {
      sounds[i].unloadAsync();
    }
  }


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

  function makeButtons() {
    const buttons = [];
    for (var i = 0; i < state.uris.length; i++) {
      const idx = i;
      const title = i == 0 ? "PRE-EQ" : "POST-EQ";
      const color = i == state.activeIndex ? colors.activeButtonColor : colors.inactiveButtonColor;
      buttons.push(<Button
        key={i}
        color={color}
        onPress={() => dispatch({type: 'play', index: idx})}
        title={title}
      />);
    }
    return buttons;
  }

  async function playAllSounds(uris: Array<string>) {
    console.log('playing sounds: ', uris);
    const sounds: Array<Audio.Sound> = [];

    for (var i = 0; i < uris.length; i++) {
      const source = { uri: uris[i] };
      const sound = new Audio.Sound();
      await sound.loadAsync(source, { ...initialStatus, volume: i == 0 ? 1 : 0 }, false);
      sounds.push(sound);

      const key = `audio_${i}`;
      const idx = i;
    }
    dispatch({type: 'setSounds', uris, sounds});
  }

  if (loading) {
    return (<><Text>Loading...</Text></>);
  }

  const buttons = makeButtons();
  console.log(buttons);

  return (
    <View>
      <View style={styles.buttons}>
        {makeButtons()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flex: 1,
    margin: 5,
  },
});

const colors = {
  activeButtonColor: 'green',
  inactiveButtonColor: 'red'
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
