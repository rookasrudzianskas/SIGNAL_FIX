import React, {useEffect, useState} from 'react';
import {Image, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View} from 'react-native';
import styles from "./style";
import {AntDesign, Feather, Ionicons, MaterialCommunityIcons, SimpleLineIcons} from "@expo/vector-icons";
import {Auth, DataStore, Storage} from "aws-amplify";
import {ChatRoom, Message} from '../../src/models';
import EmojiSelector, {Categories} from "react-native-emoji-selector";
import * as ImagePicker from 'expo-image-picker';
import 'react-native-get-random-values';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';


// @ts-ignore
const MessageInput = ({chatRoom}) => {
    const [message, setMessage] = useState('');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    // console.warn(message);

    const [image, setImage] = useState<string|null>(null);

    const resetFields = () => {
        setMessage('');
        setIsEmojiPickerOpen(false);
        setImage(null);
    }

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


    // image picker
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        // console.log(result);

        if(!result.cancelled) {
            setImage(result.uri);
        }

    };

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3]
        });

        if(!result.cancelled) {
            setImage(result.uri);
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
        if(image) {
            sendImage();
        } else if (message) {
            sendMessage();
        } else {
            onPlusClicked();
        }
    }

    const sendImage = async () => {
        // upload the image to S3 and send the url to the server
        if (!image) {
            return;
        }
        const blob = await getImageBlob();
        const {key} = await Storage.put(`${uuidv4()}.png`, blob);

        // send message
        const user = await Auth.currentAuthenticatedUser();
        const newMessage = await DataStore.save(new Message({
            content: message,
            image: image,
            userID: user.attributes.sub,
            chatroomID: chatRoom?.id,
        }));

        // // @ts-ignore
        updateLastMessage(newMessage);
        resetFields();
    }''

    const getImageBlob = async () => {
        if (!image) {
            return null;
        }
        const response = await fetch(image);
        const blob = await response.blob();
        return blob;
    };

    return (
        <KeyboardAvoidingView keyboardVerticalOffset={100} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.root, {height: isEmojiPickerOpen ? '50%' : 'auto'}]}>
            {image && (
                <View style={{flexDirection: 'row', margin: 10, alignSelf: 'stretch', justifyContent: 'space-between', borderWidth: 1, borderColor: "lightgray", borderRadius: 10, overflow: 'hidden'}}>
    {/*// @ts-ignore*/}
                    <Image  source={{uri: image}} style={{width: 150, height: 100, resizeMode: 'contain', borderRadius: 10,}}/>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => setImage(null)}>
                        <AntDesign name="close" size={24} color="black" style={{margin: 10,}} />
                    </TouchableOpacity>
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

                    <TouchableOpacity onPress={takePhoto} activeOpacity={0.6}>
                        <Feather name="camera" size={24} color="#595959"  style={{marginHorizontal: 5,}} />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.6} onPress={pickImage}>
                        <Feather name="image" size={24} color="#595959"  style={{marginHorizontal: 5,}}/>
                    </TouchableOpacity>

                    <MaterialCommunityIcons  name="microphone-outline" size={24} color="#595959" />
                </View>


                <TouchableOpacity onPress={onPress}  style={styles.buttonContainer}>
                    {message || image ? (
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


