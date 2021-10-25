import * as React from 'react';
import {FlatList, Image, StyleSheet, TouchableOpacity} from 'react-native';
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

            <FlatList data={ChatRoomsData} renderItem={({item}) => (
                <ChatRoomItem key={item} chatRoom={item} />
            )} />

        </View>
  );
}


export default HomeScreen;



