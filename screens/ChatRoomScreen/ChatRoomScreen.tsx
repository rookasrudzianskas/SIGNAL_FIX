import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Message from "../../components/Message";
import ChatRoomData from "../../assets/data/Chats";

const ChatRoomScreen = () => {
    return (
        <View style={styles.container}>
            <Message message={ChatRoomData.messages[0]} />
        </View>
    );
};

export default ChatRoomScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    }

})
