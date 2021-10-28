import React, {useState} from 'react';
import {Text, View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform} from 'react-native';
import styles from "./style";
import tw from "tailwind-react-native-classnames";
import {AntDesign, Feather, Ionicons, MaterialCommunityIcons, SimpleLineIcons} from "@expo/vector-icons";
import {Auth, DataStore} from "aws-amplify";
import { Message } from '../../src/models';

// @ts-ignore
const MessageInput = ({chatRoomId}) => {
    const [message, setMessage] = useState('');
    // console.warn(message);

    const sendMessage = async () => {
        // send message
        const user = await Auth.currentAuthenticatedUser();
        const newMessage = await DataStore.save(new Message({
            content: message,
            userID: user.attributes.sub,
            chatroomID: chatRoomId,
        }));

        setMessage('');
    }

    const onPlusClicked = () => {
        console.warn("On plus clicked");
    }

    const onPress = () => {
        if (message) {
            sendMessage();
        } else {
            onPlusClicked();
        }
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
