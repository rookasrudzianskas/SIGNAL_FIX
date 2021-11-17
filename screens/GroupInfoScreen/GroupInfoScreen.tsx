import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {ChatRoom, User} from "../../src/models";
import {DataStore} from "aws-amplify";
import {useRoute} from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";

const GroupInfoScreen = () => {

    const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>([]);

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
        <View style={tw`bg-white p-4 flex-1`}>
            <View style={tw``}>
                <Text style={tw`text-xl font-bold`}>{chatRoom?.name} 🚀</Text>
            </View>
            <View style={tw``}>
                <Text style={tw`text-xl font-bold`}>Users</Text>
            </View>

        </View>
    );
};

export default GroupInfoScreen;
