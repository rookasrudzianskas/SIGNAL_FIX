import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import styles from './style';
import tw from "tailwind-react-native-classnames";

// @ts-ignore
const Message = ({message}) => {
    const myID = 'u1';
    const isMe = message.user.id === myID;
    const blue = '#3777f0';
    const grey = 'lightgrey';

    return (
        <View style={[styles.container, {
            backgroundColor: isMe ? grey : blue,
            marginLeft: isMe ? 'auto' : 10,
            marginRight: isMe ? 10 : 'auto',
        }]}>
            <Text style={{color: isMe ? 'black' : 'white'}}>
                {message?.content}
            </Text>
        </View>
    );
};

export default Message;
