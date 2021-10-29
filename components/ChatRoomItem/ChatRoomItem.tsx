import * as React from 'react';
import {Image, StyleSheet, TouchableOpacity, View, Text, ActivityIndicator} from 'react-native';
import { RootTabScreenProps } from '../../types';
import tw from "tailwind-react-native-classnames";
import styles from "./style";
import moment from 'moment';
import {useNavigation} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {User, ChatRoomUser, Message} from "../../src/models";
import {Auth, DataStore} from "aws-amplify";


// @ts-ignore
const ChatRoomItem = ({chatRoom}) => {
    // const [users, setUsers] = useState<User[]>([]); // all users in this chatroom
    const [user, setUser] = useState<User|null>(null); // the display user
    const [lastMessage, setLastMessage] = useState<Message|undefined>();

    const navigation = useNavigation();
    console.log(chatRoom);

    useEffect(() => {
        const fetchUsers = async () => {
            const fetchedUsers = (await DataStore.query(ChatRoomUser))
                .filter(chatRoomUser => chatRoomUser.chatroom.id === chatRoom.id)
                .map(chatRoomUser => chatRoomUser.user);

            // setUsers(fetchedUsers);

            const authUser = await Auth.currentAuthenticatedUser();
            setUser(fetchedUsers.find(user => user.id !== authUser.attributes.sub) || null);
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (!chatRoom.chatRoomLastMessageId) { return }
        DataStore.query(Message, chatRoom.chatRoomLastMessageId).then(setLastMessage);
    }, [])

    const onPress = () => {
        // @ts-ignore
        navigation.navigate('ChatRoom', { id: chatRoom.id });
    }


    if(!user) {
        return (
            <View style={tw`flex items-center justify-center mt-10`}>
                <ActivityIndicator style={tw` items-center justify-center`} color={'lightblue'} size={'large'} />
            </View>
        )
    }

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
            <View style={tw`flex-row px-3`}>
                <View style={tw`p-3`}>
                    <Image source={{uri: user?.imageUri}} style={styles.image}/>
                    {!!chatRoom.newMessages && (
                        <View style={[tw`bg-blue-500 flex items-center justify-center`, {width: 20, height: 20, borderRadius: 20, position: 'absolute', left: 54, top: 10, borderWidth: 1, borderColor: 'white'}]}>
                            <Text style={[tw`text-white  font-bold`, {}]}>{chatRoom?.newMessages}</Text>
                        </View>
                    )}
                </View>
                <View style={tw`flex-1 justify-center mt-4`}>
                    <View style={tw`flex-row items-center`}>
                        <View style={tw`flex flex-row flex-1`}>
                            <Text style={tw`text-xl font-bold`}>{user?.name}</Text>
                        </View>
                        <View style={tw``}>
                            <Text style={tw`text-lg text-gray-500`}>{moment(lastMessage?.createdAt).fromNow()}</Text>
                        </View>
                    </View>
                    <Text numberOfLines={1} style={tw`text-lg text-gray-500 mb-5`}>{lastMessage?.content}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ChatRoomItem;
