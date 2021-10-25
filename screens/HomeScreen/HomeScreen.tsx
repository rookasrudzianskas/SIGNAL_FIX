import * as React from 'react';
import {Image, StyleSheet} from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import tw from "tailwind-react-native-classnames";
import styles from "./style";

const HomeScreen = ({ navigation }: RootTabScreenProps<'TabOne'>)  => {
  return (
    <View>
      <View style={tw`flex-1 flex-row`}>
        <View>
            <Image source={{uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/elon.png'}} style={styles.image}/>
        </View>
          <View>

          </View>
      </View>
    </View>
  );
}


export default HomeScreen;



