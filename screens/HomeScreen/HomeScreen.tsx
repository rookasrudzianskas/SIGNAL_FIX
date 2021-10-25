import * as React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import tw from "tailwind-react-native-classnames";
import styles from "./style";
import ChatRoomItem from "../../components/ChatRoomItem";

const HomeScreen = ({ navigation }: RootTabScreenProps<'TabOne'>)  => {
  return (
        <View>
            <ChatRoomItem />
        </View>
  );
}


export default HomeScreen;



