import * as React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import tw from "tailwind-react-native-classnames";
import styles from "./style";
import ChatRoomItem from "../../components/ChatRoomItem";
import ChatRoomsData from "../../assets/data/ChatRooms";


const HomeScreen = ({ navigation }: RootTabScreenProps<'TabOne'>)  => {

    const chatRoom1 = ChatRoomsData[0];
    const chatRoom2 = ChatRoomsData[1];
  return (
        <View style={styles.page}>
            <ChatRoomItem />
        </View>
  );
}


export default HomeScreen;



