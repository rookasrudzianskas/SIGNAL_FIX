import React, {useEffect, useState} from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    TextInput,
    TouchableOpacity,
    View,
    Text,
    Alert
} from 'react-native';
import styles from "./style";
import {AntDesign, Feather, Ionicons, MaterialCommunityIcons, SimpleLineIcons} from "@expo/vector-icons";
import {Auth, DataStore, Storage} from "aws-amplify";
import {ChatRoom, ChatRoomUser, Message, User} from '../../src/models';
import EmojiSelector, {Categories} from "react-native-emoji-selector";
import * as ImagePicker from 'expo-image-picker';
import 'react-native-get-random-values';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import {Audio, AVPlaybackStatus} from "expo-av";
import AudioPlayer from '../AudioPlayer';
import MessageComponent from '../Message';
import tw from 'tailwind-react-native-classnames';
import {box} from "tweetnacl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {PRIVATE_KEY} from "../../screens/Settings/Settings";
import {useNavigation} from "@react-navigation/native";
import {encrypt, getMySecretKey, stringToUint8Array} from "../../utils/crypto";

// @ts-ignore
const MessageInput = ({chatRoom, messageReplyTo, removeMessageReplyTo}) => {
    const [message, setMessage] = useState('');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [soundURI, setSoundURI] = useState<string | null>(null);
    // console.warn(message);


    const [image, setImage] = useState<string|null>(null);
    // reset all the fields at one function 🔥
    const resetFields = () => {
        setMessage('');
        setIsEmojiPickerOpen(false);
        setImage(null);
        setProgress(0);
        setSoundURI(null);
        removeMessageReplyTo();
    };

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const libraryResponse = await ImagePicker.requestMediaLibraryPermissionsAsync();
                const photoResponse = await ImagePicker.requestCameraPermissionsAsync();
                const audioResponse = await Audio.requestPermissionsAsync();
                if (libraryResponse.status !== 'granted' && photoResponse.status !== 'granted' && audioResponse.status !== 'granted') {
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

    const navigation = useNavigation();

    const sendMessageToUser = async (user: any, fromUserId: any) => {
        // send message
        const ourSecretKey = await getMySecretKey();
        if (!ourSecretKey) {
            return;
        }

        if (!user.publicKey) {
            Alert.alert(
                "The user haven't set his keypair yet",
                "Until the user generates the keypair, you cannot securely send him messages"
            );
            return;
        }

        console.log("private key", ourSecretKey);

        const sharedKey = box.before(
            stringToUint8Array(user.publicKey),
            ourSecretKey
        );
        console.log("shared key", sharedKey);

        const encryptedMessage = encrypt(sharedKey, { message });
        console.log("encrypted message", encryptedMessage);

        const newMessage = await DataStore.save(
            new Message({
                content: encryptedMessage, // <- this messages should be encrypted
                userID: fromUserId,
                forUserId: user.id,
                chatroomID: chatRoom.id,
                replyToMessageID: messageReplyTo?.id,
            })
        );

        // updateLastMessage(newMessage);
    };

    const sendMessage = async () => {

        // get all the users of this chatRoom

        const authUser = await Auth.currentAuthenticatedUser({ bypassCache: true });

        const users = (await DataStore.query(ChatRoomUser)).filter(cru => cru.chatroom.id === chatRoom.id).map(cru => cru.user);
        console.log('this is users');
        console.log(users);

        // for each user, encrypt the content with his or her public key and save it as the new message

        await Promise.all(users.map((user) => sendMessageToUser(user, authUser.attributes.sub)));

        // done 🔥


        // send message
        // const user = await Auth.currentAuthenticatedUser();
        // const newMessage = await DataStore.save(new Message({
        //     content: message, // this message should be encrypted
        //     userID: user.attributes.sub,
        //     chatroomID: chatRoom?.id,
        //     status: 'SENT',
        //     replyToMessageID: messageReplyTo?.id,
        // }));


        resetFields();
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
        } else if(soundURI) {
            sendAudio();
        } else if (message) {
            sendMessage();
        } else {
            onPlusClicked();
        }
    }

    // @ts-ignore
    const progressCallback = (progress) => {
        // console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        setProgress(progress.loaded / progress.total);
    };

    const sendImage = async () => {
        // upload the image to S3 and send the url to the server
        if (!image) {
            return;
        }
        const blob = await getBlob(image);
        const {key} = await Storage.put(`${uuidv4()}.png`, blob, {
            progressCallback
        });

        // send message
        const user = await Auth.currentAuthenticatedUser();
        const newMessage = await DataStore.save(new Message({
            content: message,
            image: key,
            userID: user.attributes.sub,
            chatroomID: chatRoom?.id,
            status: 'SENT',
            replyToMessageID: messageReplyTo?.id,
        }));

        // // @ts-ignore
        updateLastMessage(newMessage);
        resetFields();
    };


    const getBlob = async (uri: string) => {
        if (!uri) {
            return null;
        }
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob;
    };


    // the code for the audio recording 🔥
    async function startRecording() {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            console.log('Recoding is starting');
            const { recording } = await Audio.Recording.createAsync(
                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );
            setRecording(recording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        console.log('Recording is stopping');
        if(!recording) {
            return;
        }
        setRecording(null);
        await recording.stopAndUnloadAsync();

        await Audio.setAudioModeAsync({
           allowsRecordingIOS: false,
        });

        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);

        // sound things
        if(!uri) {
            return;
        }
        setSoundURI(uri);

    }

    const sendAudio = async () => {
        if (!soundURI) {
            return;
        }
        const uriParts = soundURI.split(".");
        const extenstion = uriParts[uriParts.length - 1];
        const blob = await getBlob(soundURI);
        const { key } = await Storage.put(`${uuidv4()}.${extenstion}`, blob, {
            progressCallback,
        });

        // send message
        const user = await Auth.currentAuthenticatedUser();
        const newMessage = await DataStore.save(
            new Message({
                content: message,
                audio: key,
                userID: user.attributes.sub,
                chatroomID: chatRoom.id,
                status: 'SENT',
                replyToMessageID: messageReplyTo?.id,

            })
        );

        updateLastMessage(newMessage);

        resetFields();
    };

    // @ts-ignore
    return (
        <KeyboardAvoidingView keyboardVerticalOffset={100} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.root, {height: isEmojiPickerOpen ? '50%' : 'auto'}]}>

            {messageReplyTo && (
                <View style={tw`rounded-md p-2`}>
                    <View style={tw`bg-gray-100 rounded-md`}>
                        <View style={tw`flex flex-row items-center`}>
                            <Text style={tw`p-2 flex-1`}>Reply to:</Text>
                            <TouchableOpacity activeOpacity={0.5} onPress={() => removeMessageReplyTo()}>
                                <AntDesign style={tw`mr-2`} name="close" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                        <MessageComponent message={messageReplyTo} />
                    </View>
                </View>
            )}


            {image && (
                <View style={{flexDirection: 'row', margin: 10, alignSelf: 'stretch', justifyContent: 'space-between', borderWidth: 1, borderColor: "lightgray", borderRadius: 10, overflow: 'hidden'}}>
    {/*// @ts-ignore*/}
                    <Image  source={{uri: image}} style={{width: 150, height: 100, resizeMode: 'contain', borderRadius: 10,}}/>

                    <View
                        style={{
                            flex: 1,
                            justifyContent: "flex-start",
                            alignSelf: "flex-end",
                        }}
                    >
                        <View
                            style={{
                                height: 3,
                                borderRadius: 10,
                                backgroundColor: "#3777f0",
                                width: `${progress * 100}%`,
                            }}
                        />
                    </View>

                    <TouchableOpacity activeOpacity={0.6} onPress={() => setImage(null)}>
                        <AntDesign name="close" size={24} color="black" style={{margin: 10,}} />
                    </TouchableOpacity>
                </View>
            )}

            {soundURI && <AudioPlayer soundURI={soundURI} />}


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

                    {/*@ts-ignore*/}
                    <Pressable onPressIn={startRecording} onPressOut={stopRecording}>
                        <MaterialCommunityIcons  name={recording ? 'microphone' : 'microphone-outline'} size={24} color={recording ? 'red' : '#595959'} />
                    </Pressable>
                </View>


                <TouchableOpacity onPress={onPress}  style={styles.buttonContainer}>
                    {message || image || soundURI ? (
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


