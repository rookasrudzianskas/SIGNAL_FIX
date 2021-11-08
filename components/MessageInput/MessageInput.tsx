import React, {useEffect, useState} from 'react';
import {Image, KeyboardAvoidingView, Platform, Pressable, TextInput, TouchableOpacity, View, Text} from 'react-native';
import styles from "./style";
import {AntDesign, Feather, Ionicons, MaterialCommunityIcons, SimpleLineIcons} from "@expo/vector-icons";
import {Auth, DataStore, Storage} from "aws-amplify";
import {ChatRoom, Message} from '../../src/models';
import EmojiSelector, {Categories} from "react-native-emoji-selector";
import * as ImagePicker from 'expo-image-picker';
import 'react-native-get-random-values';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import {Audio, AVPlaybackStatus} from "expo-av";


// @ts-ignore
const MessageInput = ({chatRoom}) => {
    const [message, setMessage] = useState('');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [paused, setPaused] = useState(true);
    const [audioProgress, setAudioProgress] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const [soundURI, setSoundURI] = useState<string | null>(null);


    // console.warn(message);

    const [image, setImage] = useState<string|null>(null);

    const resetFields = () => {
        setMessage('');
        setIsEmojiPickerOpen(false);
        setImage(null);
        setProgress(0);
    }

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


    // the code for the audio recording
    // @ts-ignore
    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if(!status.isLoaded) {
            return;
        }

        setAudioProgress(status.positionMillis / (status.durationMillis || 1));
        setPaused(!status.isPlaying);
        setAudioDuration(status.durationMillis || 0);
    }

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
        const { sound } = await Audio.Sound.createAsync({ uri }, {}, onPlaybackStatusUpdate);
        setSound(sound);
    }

    const playPauseSound = async () => {
        if (!sound) {
            return;
        }
        if (paused) {
            await sound.playFromPositionAsync(0);
        } else {
            await sound.pauseAsync();
        }
    };

    const getDuration = () => {
        const minutes = Math.floor(audioDuration / (60 * 1000));
        const seconds = Math.floor((audioDuration % (60 * 1000)) / 1000);

        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const sendAudio = async () => {
        // upload the sound to S3 and send the url to the server
        if (!soundURI) {
            return;
        }
        const uriParts = soundURI.split('.');
        const extension = uriParts[uriParts.length - 1];
        const blob = await getBlob(soundURI);
        // @ts-ignore
        const {sound} = await Storage.put(`${uuidv4()}.${extension}`, blob, {
            progressCallback
        });

        // send message
        const user = await Auth.currentAuthenticatedUser();
        // const newMessage = await DataStore.save(new Message({
        //     content: message,
        //     audio: sound,
        //     userID: user.attributes.sub,
        //     chatroomID: chatRoom?.id,
        // }));
        //
        // // // @ts-ignore
        // updateLastMessage(newMessage);
        // resetFields();
    };

    // @ts-ignore
    return (
        <KeyboardAvoidingView keyboardVerticalOffset={100} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.root, {height: isEmojiPickerOpen ? '50%' : 'auto'}]}>
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

            {sound && (
                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10, alignSelf: 'stretch', justifyContent: 'space-between', borderWidth: 1, borderColor: "lightgray", borderRadius: 10, overflow: 'hidden', padding: 10}}>
                    <TouchableOpacity activeOpacity={0.6} onPress={playPauseSound}>
                        <Feather name={paused ? 'play' : 'pause'} size={24} color="gray" style={{}} />
                    </TouchableOpacity>

                    <View style={styles.audioProgressBG}>
                        <View style={{
                            width: 10,
                            height: 10,
                            borderRadius: 10,
                            backgroundColor: '#3777f0',
                            position: 'absolute',
                            top: -3,
                            left: `${audioProgress * 100}%`,
                        }}>

                        </View>
                    </View>
                        <Text>{getDuration()}</Text>
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


