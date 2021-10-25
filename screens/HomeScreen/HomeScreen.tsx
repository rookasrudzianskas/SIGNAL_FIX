import * as React from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import tw from "tailwind-react-native-classnames";
import styles from "./style";

const HomeScreen = ({ navigation }: RootTabScreenProps<'TabOne'>)  => {
  return (
    <View style={styles.container}>
      <Text style={tw`text-xl font-bold`}>Signal 🔥</Text>
    </View>
  );
}


export default HomeScreen;



