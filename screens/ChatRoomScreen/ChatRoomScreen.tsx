import React from 'react';
import {Text, View, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import Message from "../../components/Message";
import chatRoomData from "../../assets/data/Chats";
import MessageInput from "../../components/MessageInput";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {useNavigation, useRoute} from "@react-navigation/native";

const ChatRoomScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    navigation.setOptions({title: 'Rokas Rudzianskas'});

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
