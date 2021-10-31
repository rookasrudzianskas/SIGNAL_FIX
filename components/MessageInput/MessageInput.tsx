import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform} from 'react-native';
import styles from "./style";
import tw from "tailwind-react-native-classnames";
import {AntDesign, Feather, Ionicons, MaterialCommunityIcons, SimpleLineIcons} from "@expo/vector-icons";
import {Auth, DataStore} from "aws-amplify";
import {ChatRoom, Message} from '../../src/models';
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


// @ts-ignore
const MessageInput = ({chatRoom}) => {
    const [message, setMessage] = useState('');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    // console.warn(message);

    const [image, setImage] = useState<String|null>(null);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const libraryResponse = await ImagePicker.requestMediaLibraryPermissionsAsync();
                const photoResponse = await ImagePicker.requestCameraPermissionsAsync();
                if (libraryResponse.status !== 'granted' && photoResponse.status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if(!result.cancelled) {
            setImage(result.uri)
        }

    };

    const sendMessage = async () => {
        // send message
        const user = await Auth.currentAuthenticatedUser();
        const newMessage = await DataStore.save(new Message({
            content: message,
            userID: user.attributes.sub,
            chatroomID: chatRoom?.id,
        }));

        // @ts-ignore
        updateLastMessage(newMessage);

        setMessage('');
        setIsEmojiPickerOpen(false);
    }

    // @ts-ignore
    const updateLastMessage = async (newMessage) => {
        await DataStore.save(ChatRoom.copyOf(chatRoom, updatedChatRoom => {
            updatedChatRoom.LastMessage = newMessage;
        }))
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
        <KeyboardAvoidingView keyboardVerticalOffset={100} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.root, {height: isEmojiPickerOpen ? '50%' : 'auto'}]}>
            {image && (
                <View>

                </View>
            )}
            <View style={[styles.row]}>
                <View style={styles.inputContainer}>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}>
                        <SimpleLineIcons name="emotsmile" size={24} color="#595959" style={{marginHorizontal: 5,}} />
                    </TouchableOpacity>

                    <TextInput
                        style={{flex: 1, marginHorizontal: 5,}}
                        placeholder="Type a message here"
                        value={message}
                        onChangeText={(text) => setMessage(text)}
                    />

                    <TouchableOpacity activeOpacity={0.6}>
                        <Feather name="camera" size={24} color="#595959"  style={{marginHorizontal: 5,}} />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.6} onPress={pickImage}>
                        <Feather name="image" size={24} color="#595959"  style={{marginHorizontal: 5,}}/>
                    </TouchableOpacity>

                    <MaterialCommunityIcons  name="microphone-outline" size={24} color="#595959" />
                </View>


                <TouchableOpacity onPress={onPress}  style={styles.buttonContainer}>
                    {message ? (
                        <Ionicons name="ios-send" size={18} color="white" />
                    ) : (
                        <AntDesign name="plus" size={24} color="white" />
                    )}
                </TouchableOpacity>
            </View>

            {isEmojiPickerOpen && (
                <EmojiSelector
                    category={Categories.symbols}
                    columns={9}
                    onEmojiSelected={emoji => setMessage(currentMessage => currentMessage + emoji)}
                />
            )}
        </KeyboardAvoidingView>
    );
};

export default MessageInput;
