import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import styles from './style';
import tw from "tailwind-react-native-classnames";

const Message = () => {
    const isMe = true;


    return (
        <View style={[styles.container]}>
            <Text style={tw`text-gray-100`}>
                Message 🚀
            </Text>
        </View>
    );
};

export default Message;
