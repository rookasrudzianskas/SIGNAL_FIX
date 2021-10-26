import React from 'react';
import {Text, View, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import Message from "../../components/Message";
import chatRoomData from "../../assets/data/Chats";
import MessageInput from "../../components/MessageInput";
import {SafeAreaProvider} from "react-native-safe-area-context";

const ChatRoomScreen = () => {
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

})
