import * as React from 'react';
import { Text, View } from '../components/Themed';
import { Button, StyleSheet, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';

export function FrequencySlider(props) {
  const [freq, setFreq] = React.useState(500);
  const onSlidingComplete = props.onSlidingComplete;


  const onTouchMove = function(val: number) {
    setFreq(logslider(val));
  };


  const done = function(val: number) {
    const guess = logslider(val);
    onSlidingComplete(guess);
  }

  return (
    <View>
      <Text>{freq}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={0.5}
        minimumTrackTintColor="#FFF000"
        maximumTrackTintColor="#000000"
        onValueChange={onTouchMove}
        onSlidingComplete={onSlidingComplete}
      />
    </View>
  );
}

function logslider(position: number) {
  // position will be between 0 and 100
  var minp = 0.0;
  var maxp = 1.0;

  var minv = Math.log(20);
  var maxv = Math.log(20000);

  // calculate adjustment factor
  var scale = (maxv-minv) / (maxp-minp);

  return Math.ceil(Math.exp(minv + scale*(position-minp)));
}

const styles = StyleSheet.create({
  slider: {
    width: 200,
    height: 40,
  },
});
