import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Message from "../../components/Message";

const ChatRoomScreen = () => {
    return (
        <View style={styles.container}>
            <Message />
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
