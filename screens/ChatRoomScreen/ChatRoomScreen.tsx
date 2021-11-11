import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, FlatList, SafeAreaView, ActivityIndicator} from 'react-native';
import Message from "../../components/Message";
import chatRoomData from "../../assets/data/Chats";
import MessageInput from "../../components/MessageInput";
import {useNavigation, useRoute} from "@react-navigation/native";
import {ChatRoom, Message as MessageModel} from "../../src/models";
import {DataStore, SortDirection} from "aws-amplify";

const ChatRoomScreen = () => {
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [chatRoom, setChatRoom] = useState<ChatRoom|null>(null);
    const [messageReplyTo, setMessageReplyTo] = useState<MessageModel|null>(null);
    const route = useRoute();
    const navigation = useNavigation();

    useEffect(() => {
        fetchChatRoom();
    }, []);

    useEffect(() => {
        if(!chatRoom) {
            return;3
        }
        fetchMessages();
    }, [chatRoom]);

    useEffect(() => {
        const subscription = DataStore.observe(MessageModel).subscribe(msg => {
            // console.log(msg.model, msg.opType, msg.element);
            if (msg.model === MessageModel && msg.opType === 'INSERT') {
                setMessages(existingMessage => [msg.element,...existingMessage])
            }
        });

        return () => subscription.unsubscribe();
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

    const fetchMessages = async () => {
        if (!chatRoom) {
            return;
        }
        const fetchedMessages = await DataStore.query(MessageModel,
            message => message.chatroomID("eq", chatRoom?.id),
            {
                sort: message => message.createdAt(SortDirection.DESCENDING)
            }
        );

        // console.log(fetchedMessages);
        setMessages(fetchedMessages);
    };

    if(!chatRoom) {
        return <ActivityIndicator size={'large' } color={'green'} />
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <FlatList data={messages} showsVerticalScrollIndicator={false}  renderItem={({item}) => <Message message={item} setAsMessageReply={() => setMessageReplyTo(item)} inverted />} />
                <MessageInput chatRoom={chatRoom} messageReplyTo={messageReplyTo} />
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
