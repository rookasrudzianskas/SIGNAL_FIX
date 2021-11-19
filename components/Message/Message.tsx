import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, ActivityIndicator, useWindowDimensions, Pressable} from 'react-native';
import tw from "tailwind-react-native-classnames";
import {Message as MessageModel, User} from "../../src/models";
import {Auth, DataStore, Storage} from "aws-amplify";
// @ts-ignore
import {S3Image} from "aws-amplify-react-native";
import AudioPlayer from "../AudioPlayer";
import {Ionicons} from "@expo/vector-icons";
import MessageReply from '../MessageReply';
import {useActionSheet} from "@expo/react-native-action-sheet";

const blue = '#3777f0';
const grey = 'lightgrey';
const myID = 'u1';

// @ts-ignore
const Message = (props) => {
    const {setAsMessageReply, message: propMessage } = props;

    const [user, setUser] = useState<User|undefined>();
    const [repliedTo, setRepliedTo] = useState<MessageModel|undefined>(undefined);
    const [isMe, setIsMe] = useState<boolean | null>(null);
    const [soundURI, setSoundURI] = useState<any>(null);
    const [message, setMessage] = useState<MessageModel>(props.message);
    const { width } = useWindowDimensions();
    const { showActionSheetWithOptions } = useActionSheet();



    useEffect(() => {
        // @ts-ignore
        DataStore.query(User, message.userID).then(setUser);
    }, []);

    useEffect(() => {
        setMessage(propMessage);
    }, [propMessage]);

    useEffect(() => {
        if(message?.replyToMessageID) {
            // @ts-ignore}
            DataStore.query(MessageModel, message.replyToMessageID).then(setRepliedTo);
        }
    }, [message]);



    useEffect(() => {
        const subscription = DataStore.observe(MessageModel, message.id).subscribe(msg => {
            // console.log(msg.model, msg.opType, msg.element);
            if (msg.model === MessageModel && msg.opType === 'UPDATE') {
                setMessage(message => ({...message, ...msg.element}));
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(()  => {
        setAsRead();
    }, [isMe, message]);

    useEffect(() => {
        if (message.audio) {
            Storage.get(message.audio).then(setSoundURI);
        }
    }, [message]);

    useEffect(() => {
        const checkIfMe = async () => {
            if(!user) {
                return;
            }
            const authUser = await Auth.currentAuthenticatedUser();
            setIsMe(user.id === authUser.attributes.sub);
        }
        checkIfMe();
    }, [user]);

    const setAsRead = async () => {
        // @ts-ignore
        if (isMe === false && message.status !== "READ") {
            await DataStore.save(MessageModel.copyOf(message, (updated) => {
        // @ts-ignore
                updated.status = "READ";
            }));
        }
    }


    if(!user) {
        return (
            <View style={tw`flex items-center justify-center mt-10`}>
                <ActivityIndicator style={tw` items-center justify-center`} color={'lightblue'} size={'large'} />
            </View>
        );
    }


    const onActionPress = (index: any) => {
        console.warn(index);
    }

    const openActionMenu = () => {
        const options = ["Reply", "Delete", "Cancel"];
        const destructiveButtonIndex = 1;
        const cancelButtonIndex = 2;
        showActionSheetWithOptions(
            {
                options,
                destructiveButtonIndex,
                cancelButtonIndex,
            },
            onActionPress
        );
    }

    // @ts-ignore
    return (
        <Pressable onLongPress={openActionMenu} style={[styles.container, isMe ? styles.rightContainer : styles.leftContainer, {width: soundURI ? '75%' : 'auto'}]}>
            {/*<View style={{alignItems: 'flex-end'}}>*/}

            {repliedTo && (
                <MessageReply messageReply={repliedTo.content} />
            )}


                {message.image && (
                    <View style={{marginBottom: message.content ? 10 : 0}}>
                        <S3Image
                            style={{ width: width * 0.6, aspectRatio: 4 / 3, borderRadius: 10 }}
                            resizeMode={'contain'}
                            imgKey={message.image}
                            theme={'dark'}
                            level={'public'}
                        />
                    </View>
                )}

            <View style={{width: '100%'}}>
                {soundURI && <AudioPlayer soundURI={soundURI} />}
            </View>
                {/*{soundURI && (*/}
                {/*    <View>*/}
                {/*        <Text>Rokas</Text>*/}
                {/*    </View>*/}
                {/*)}*/}
                {/*<AudioPlayer  soundURI={soundURI}/>*/}
                <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                    {!!message.content && (
                        <Text style={{color: isMe ? 'black' : 'white'}}>
                            {message?.content}
                        </Text>
                    )}
                    {/*@ts-ignore*/}
                    {isMe && message.status !== "SENT" && !!message.status && (
                    // @ts-ignore
                        <Ionicons name={message.status === 'DELIVERED' ? 'checkmark' : 'checkmark-done'} size={16} color="gray" style={{
                            marginHorizontal: 5,
                        }} />
                    )}
                </View>
            {/*</View>*/}

        </Pressable>
    );
};

export default Message;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3777f0',
        padding: 10,
        margin: 10,
        borderRadius: 10,
        // flexDirection: 'row',

        alignItems: "flex-end",

        // maxWidth: '75%',
    },
    leftContainer: {
        backgroundColor: blue,
        marginLeft: 10,
        marginRight: 'auto',
    },
    rightContainer: {
        backgroundColor: grey,
        marginLeft: 'auto',
        marginRight: 10,
    }
});


