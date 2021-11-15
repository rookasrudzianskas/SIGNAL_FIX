import * as React from 'react';
import {FlatList, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import tw from "tailwind-react-native-classnames";
import styles from "./style";
import ChatRoomItem from "../../components/ChatRoomItem";
import UserItem from "../../components/UserItem";
import {Auth, DataStore} from 'aws-amplify';
import {useEffect, useState} from "react";
import {ChatRoom, ChatRoomUser, User} from "../../src/models";
import NewGroupButton from "../../components/NewGroupButton";
import {useNavigation} from "@react-navigation/native";



const UsersScreen = ()  => {

    const [users, setUsers] = useState<User[]>([]);

    // useEffect(() => {
    //     DataStore.query(User).then(setUsers);
    // }, []);

    useEffect(() => {
        // querying the users
        const fetchUsers = async () => {
            const fetchedUsers = await DataStore.query(User);
            setUsers(fetchedUsers);
        };

        fetchUsers();
    }, []);


    const navigation = useNavigation();

    // @ts-ignore
    const addUserToChatRoom = async (user, chatroom) => {
        await DataStore.save(
            new ChatRoomUser({
                user,
                chatroom: chatroom,
            })
        )
    }

    // @ts-ignore
    const createChatRoom = async (users) => {

        // TODO if there is already a chat room between these 2 users
        // then redirect to the existing chat room
        // otherwise, create a new chatroom with these users.

        // Create a chat room
        const newChatRoom = await DataStore.save(new ChatRoom({newMessages: 0}));

        // connect authenticated user with the chat room
        const authUser = await Auth.currentAuthenticatedUser();
        const dbUser = await DataStore.query(User, authUser.attributes.sub);
        if(dbUser){
            await addUserToChatRoom(dbUser, newChatRoom);
        }


        // connect the users with the chat room
        // @ts-ignore
        await Promise.all(users.map((user) => addUserToChatRoom(user, newChatRoom)));


        // @ts-ignore
        navigation.navigate('ChatRoomScreen', { id: newChatRoom.id });

    }

    const onUserPress = async (user: any) => {
        await createChatRoom([user]);
    }

  return (
        <View style={styles.page}>

            <FlatList showsVerticalScrollIndicator={false}
                      ListHeaderComponent={NewGroupButton}
                      data={users} renderItem={({item}) => (
                        <UserItem user={item} onPress={() => onUserPress(item)} key={item.id} />
            )}
            />

        </View>
  );
}


export default UsersScreen;



