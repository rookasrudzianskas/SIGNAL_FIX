import * as React from 'react';
import {FlatList, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import tw from "tailwind-react-native-classnames";
import styles from "./style";
import ChatRoomItem from "../../components/ChatRoomItem";
import ChatRoomsData from "../../assets/data/ChatRooms";
import {useEffect, useState} from "react";
import {ChatRoom, ChatRoomUser} from "../../src/models";
import {Auth, DataStore} from "aws-amplify";


const HomeScreen = ({ navigation }: RootTabScreenProps<'TabOne'>)  => {

    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

    useEffect(() => {
        const fetchChatRooms = async () => {
            const userData = await Auth.currentAuthenticatedUser();

            const chatRooms = (await DataStore.query(ChatRoomUser)).filter(chatRoomUser => chatRoomUser.user.id === userData.attributes.sub);
            console.log(chatRooms);
            setChatRooms(chatRooms);
        };
        fetchChatRooms();
    }, []);

  return (
        <View style={styles.page}>

            {/*<FlatList showsVerticalScrollIndicator={false} data={chatRooms} renderItem={({item}) => (*/}
            {/*    <ChatRoomItem key={item.id} chatRoom={item} />*/}
            {/*)}  />*/}

        </View>
  );
}


export default HomeScreen;



