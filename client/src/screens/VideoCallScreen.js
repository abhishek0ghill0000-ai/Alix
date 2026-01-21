// client/src/screens/VideoCallScreen.js
import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Alert } from 'react-native';
import Sound from 'react-native-sound';

export default function VideoCallScreen() {
  const [callActive, setCallActive] = useState(false);

  const endCall = () => {
    Sound.play('sounds/call-end.mp3'); // End call sound
    Alert.alert('Call Ended');
  };

  return (
    <View style={{flex: 1, justifyContent: 'flex-end', padding: 20}}>
      {/* Video Placeholder */}
      <View style={{flex: 1, backgroundColor: '#000'}} />
      
      {/* Bottom Controls */}
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <TouchableOpacity>
          <Image source={require('../assets/icons/action/icon_switch_camera.png')} style={{width: 50, height: 50}} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../assets/icons/action/icon_mic_off.png')} style={{width: 50, height: 50}} />
        </TouchableOpacity>
        <TouchableOpacity onPress={endCall}>
          <Image source={require('../assets/icons/action/icon_end_call.png')} style={{width: 60, height: 60}} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../assets/icons/action/icon_camera_off.png')} style={{width: 50, height: 50}} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
