import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, FlatList, Alert} from 'react-native';
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
            //@ts-ignore
            .filter(chatRoomUser => chatRoomUser.chatroom.id === route?.params?.id)
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

    const confirmDelete = (user: any) => {
        // @ts-ignore
        if(user.id === chatRoom?.Admin?.id) {
            Alert.alert('Cannot delete the group admin');
            return;
        }

        Alert.alert('Confirm delete', `Hey are you sure you want to delete ${user?.name} from this group??`, [
            {
                text: 'Yes, I want',
                onPress: () => deleteUser(user),
                style: 'destructive',
            },
            {
                text: 'Cancel',
                // onPress: () => deleteUser(user),
            }
        ]);
    }

    const deleteUser = async (user: any) => {
        // console.warn('delete user');
        await DataStore.delete(user);
    }

    return (
        <View style={tw`bg-white flex-1`}>
            <View style={tw` px-4 pt-4`}>
                <Text style={tw`text-xl font-bold`}>{chatRoom?.name || 'Chat'} 🚀</Text>
            </View>
            <View style={tw``}>
                <View style={tw`px-4`}>
                    <Text style={tw`text-xl font-bold`}>Users in this chatRoom ({allUsers.length})</Text>
                </View>
                {/* @ts-ignore*/}
                <FlatList data={allUsers} renderItem={({ item }) => <UserItem onLongPress={() => confirmDelete(item)} user={item} isAdmin={chatRoom?.Admin?.id === item.id} />} />
            </View>

        </View>
    );
};

export default GroupInfoScreen;
