import React, {useState} from 'react';
import {Text, View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform} from 'react-native';
import styles from "./style";
import tw from "tailwind-react-native-classnames";
import {AntDesign, Feather, Ionicons, MaterialCommunityIcons, SimpleLineIcons} from "@expo/vector-icons";
import Message from "../Message";
import {Auth, DataStore} from "aws-amplify";

// @ts-ignore
const MessageInput = ({chatRoomId}) => {
    const [message, setMessage] = useState('');

    const onPress = () => {
        if(message) {
            sendMessage();
        } else {
            onPlusClicked();
        }
    }

    const sendMessage = async () => {
        // send message
        const user = await Auth.currentAuthenticatedUser();
        // @ts-ignore
        const newMessage = await DataStore.save(new Message({
        // @ts-ignore
            content: message,
            userID: user.attributes.sub,
        // @ts-ignore
            chatroomID: chatRoom.id,
        }));
        setMessage('');
    }

    const onPlusClicked = () => {
        console.warn('On plus clicked');
    }

    return (
        <KeyboardAvoidingView keyboardVerticalOffset={100} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.root}>
            <View style={styles.inputContainer}>
                <SimpleLineIcons name="emotsmile" size={24} color="#595959" style={{marginHorizontal: 5,}} />

                <TextInput
                    style={{flex: 1, marginHorizontal: 5,}}
                    placeholder="Type a message here"
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                />

                <Feather name="camera" size={24} color="#595959" />
                <MaterialCommunityIcons style={{marginHorizontal: 5,}} name="microphone-outline" size={24} color="#595959" />
            </View>
            <TouchableOpacity onPress={onPress}  style={styles.buttonContainer}>
                {message ? (
                    <Ionicons name="ios-send" size={18} color="white" />
                ) : (
                    <AntDesign name="plus" size={24} color="white" />
                )}
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

export default MessageInput;
