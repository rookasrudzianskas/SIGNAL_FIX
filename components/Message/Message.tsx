import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import styles from './style';
import tw from "tailwind-react-native-classnames";

const Message = ({message}) => {
    const isMe = true;
    const blue = '#3777f0';
    const grey = 'lightgrey';

    return (
        <View style={[styles.container, {
            backgroundColor: isMe ? grey : blue,
            marginLeft: isMe ? 'auto' : 10,
        }]}>
            <Text style={{color: isMe ? 'black' : 'white'}}>
                {message?.content}
            </Text>
        </View>
    );
};

export default Message;
