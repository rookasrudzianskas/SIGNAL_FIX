import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, FlatList} from 'react-native';
import {ChatRoom, ChatRoomUser, User} from "../../src/models";
import {Auth, DataStore} from "aws-amplify";
import {useRoute} from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import UserItem from "../../components/UserItem";

const GroupInfoScreen = () => {

    const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>([]);


    const route = useRoute();
    // console.log(chatRoom);

    useEffect(() => {
        fetchChatRoom();
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const fetchedUsers = (await DataStore.query(ChatRoomUser))
            .filter(chatRoomUser => chatRoomUser.chatroom.id === id)
            .map(chatRoomUser => chatRoomUser.user);

        setAllUsers(fetchedUsers);
    };

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

                <FlatList data={allUsers} renderItem={({ item }) => <UserItem user={item} />} />
            </View>

        </View>
    );
};

export default GroupInfoScreen;
