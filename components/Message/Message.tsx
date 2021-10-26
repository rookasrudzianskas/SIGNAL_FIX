import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import styles from './style';
import tw from "tailwind-react-native-classnames";

const Message = () => {
    const isMe = true;
    const blue = '#3777f0';
    const grey = 'lightgrey';

    return (
        <View style={[styles.container, {backgroundColor: isMe ? grey : blue}]}>
            <Text style={[tw`text-gray-100`]}>
                Message 🚀
            </Text>
        </View>
    );
};

export default Message;
