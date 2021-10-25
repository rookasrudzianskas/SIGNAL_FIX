import * as React from 'react';
import {Image, StyleSheet} from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import tw from "tailwind-react-native-classnames";
import styles from "./style";

const HomeScreen = ({ navigation }: RootTabScreenProps<'TabOne'>)  => {
  return (
    <View>
      <View style={tw`flex-row items-center justify-center p-1 bg-red-500`}>
        <View style={tw`p-3`}>
            <Image source={{uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/elon.png'}} style={styles.image}/>
        </View>
          <View style={tw` bg-blue-500 flex-1`}>
              <View style={tw`flex-row items-center`}>
                  <View style={tw``}>
                    <Text style={tw`text-xl font-bold`}>Rokas Rudzianskas</Text>
                  </View>
                  <View style={tw``}>
                    <Text style={tw`text-lg text-gray-500`}>11:11AM</Text>
                  </View>
              </View>
              <Text style={tw`text-lg text-gray-500`}>Hola Hola Hola Ola!</Text>
          </View>
      </View>
    </View>
  );
}


export default HomeScreen;



