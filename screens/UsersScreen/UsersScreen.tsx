import * as React from 'react';
import {FlatList, Image, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
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
    const [isNewGroup, setIsNewGroup] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

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

    const isUserSelected = (user: any) => {
        return selectedUsers.some((selectedUser) => selectedUser.id === user.id);
    }

    const onUserPress = async (user: any) => {
        if(isNewGroup) {
            if(isUserSelected(user)) {
                // remove it from selected
                setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser.id !== user.id));
            } else {
                setSelectedUsers([...selectedUsers, user]);
            }
        } else {
            await createChatRoom([user]);
        }
    };

    const saveGroup = async () => {
        await createChatRoom(selectedUsers);
    }

  return (
        <SafeAreaView style={styles.page}>

            <FlatList showsVerticalScrollIndicator={false}
                      ListHeaderComponent={() => <NewGroupButton onPress={() => setIsNewGroup(!isNewGroup)} />}
                      data={users} renderItem={({item}) => (
                        <UserItem user={item} isSelected={isNewGroup ? isUserSelected(item) : undefined} onPress={() => onUserPress(item)} key={item.id}  />
            )}
            />


            {isNewGroup && (
                <TouchableOpacity activeOpacity={0.5} onPress={saveGroup}>
                    <View style={tw`px-5 py-4 bg-blue-500 mx-16 items-center justify-center  rounded-sm shadow-md`}>
                        <Text style={tw`font-bold text-gray-200`}>Create a Group ({selectedUsers.length})</Text>
                    </View>
                </TouchableOpacity>
            )}

        </SafeAreaView>
  );
}


export default UsersScreen;



