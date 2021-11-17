import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {ChatRoom} from "../../src/models";
import {DataStore} from "aws-amplify";
import {useRoute} from "@react-navigation/native";

const GroupInfoScreen = () => {

    const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
    const route = useRoute();
    // console.log(chatRoom);

    useEffect(() => {
        fetchChatRoom();
    }, []);

    const fetchChatRoom = async () => {
        // @ts-ignore
        if(!route?.params?.id) {
            console.warn('No chat id is provided.');
            return;
        }
        // @ts-ignore
        const chatRoom = await DataStore.query(ChatRoom, route?.params?.id);

        if(!chatRoom) {
            console.error("Coud not find the chat room");
        } else {
            setChatRoom(chatRoom);
        }
        // const fetchMessages = await DataStore.query(MessageModel);
    };

    return (
        <View>
            <Text>
                {chatRoom?.name} 🚀
            </Text>
        </View>
    );
};

export default GroupInfoScreen;
