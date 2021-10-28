import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import Message from "../../components/Message";
import chatRoomData from "../../assets/data/Chats";
import MessageInput from "../../components/MessageInput";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {useNavigation, useRoute} from "@react-navigation/native";
import {ChatRoom, Message as MessageModel} from "../../src/models";
import {DataStore} from "aws-amplify";

const ChatRoomScreen = () => {
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [chatRoom, setChatRoom] = useState<ChatRoom|null>(null);
    const route = useRoute();
    const navigation = useNavigation();
    navigation.setOptions({title: 'Rokas Rudzianskas'});

    useEffect(() => {
        fetchChatRoom();
    }, []);

    useEffect(() => {
        if(!chatRoom) {
            return;
        }
        fetchMessages();
    }, [chatRoom]);


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

    const fetchMessages = async () => {
        const fetchedMessages = await DataStore.query(MessageModel, message => message.chatroomID());
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <FlatList inverted data={chatRoomData.messages} renderItem={({item}) => (
                    <Message message={item} />
                )} />
                <MessageInput />
            </SafeAreaView>
        </>
    );
};


export default ChatRoomScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    }

});
