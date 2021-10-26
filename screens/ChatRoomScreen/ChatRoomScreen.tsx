import React from 'react';
import {Text, View, StyleSheet, FlatList} from 'react-native';
import Message from "../../components/Message";
import chatRoomData from "../../assets/data/Chats";

const ChatRoomScreen = () => {
    return (
        <View style={styles.container}>
            <FlatList style={{backgroundColor: 'red'}} inverted data={chatRoomData.messages} renderItem={({item}) => (
                <Message message={item} />
            )} />
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
