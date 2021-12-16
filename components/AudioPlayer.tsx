import { Audio, AVPlaybackStatusToSet } from 'expo-av';
import * as React from 'react';
import { StyleSheet, Button } from 'react-native';

export function MultiAudioPlayer(props) {
  var playingIndex = 0;
  const playing = false;

  const uris = props.uris;

  const [sounds, setSounds] = React.useState([]);
  const [currentSound, setCurrentSound] = React.useState<Audio.Sound|null>(null);
  const [offset, setOffset] = React.useState<number>(0);
  const [soundIdx, setSoundIdx] = React.useState(-1);

  const initialStatus = {
    shouldPlay: true,
    rate: 1.0,
    shouldCorrectPitch: false,
    volume: 1.0,
    isMuted: true,
    isLooping: true,
  };


  const toggleMutes = async function() {
    for (var i = 0; i < sounds.length; i++) {
      var sound = sounds[i];
      sound.setIsMutedAsync(i != soundIdx);
      sound.playAsync();
    }
  }


  React.useEffect(toggleMutes, [soundIdx]);

  const [buttons, setButtons] = React.useState([]);

  const playAllSounds = function() {
    const newSounds = [];
    const butts = [];
    for (var i = 0; i < uris.length; i++) {
      const source = { uri: uris[i] };
      const idx = i;

      try {
        newSounds[i] = new Audio.Sound();
        newSounds[i].loadAsync(
          source,
          initialStatus,
          false
        );

        const title = "PLAY " + i;
        const key = `audio_${i}`;

        butts.push(<Button key={key} onPress={() => setSoundIdx(idx)} title={title}/>);
      } catch (error) {
        console.log(`An error occurred: ${error}`);
      }
    }
    setButtons(butts);
    setSounds(newSounds);
  }

  React.useEffect(playAllSounds, [uris]);


  return buttons;
}
