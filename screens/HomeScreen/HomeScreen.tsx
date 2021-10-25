import * as React from 'react';
import {Image, StyleSheet} from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import tw from "tailwind-react-native-classnames";
import styles from "./style";

const HomeScreen = ({ navigation }: RootTabScreenProps<'TabOne'>)  => {
  return (
    <View>
      <View style={tw`flex-row items-center justify-center`}>
        <View style={tw`p-3`}>
            <Image source={{uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/elon.png'}} style={styles.image}/>
        </View>
          <View style={tw`pl-2`}>
              <View style={tw`flex-row items-center`}>
                  <View>
                    <Text style={tw`text-xl font-bold mr-12`}>Rokas Rudzianskas</Text>
                  </View>
                  <View>
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



