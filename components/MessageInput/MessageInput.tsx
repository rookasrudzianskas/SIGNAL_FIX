import React from 'react';
import {Text, View, StyleSheet, TextInput} from 'react-native';
import styles from "./style";
import tw from "tailwind-react-native-classnames";

const MessageInput = () => {
    return (
        <View style={styles.root}>
            <View style={styles.inputContainer}>
                <TextInput />
            </View>
            <View style={styles.buttonContainer}>
                <Text style={tw`text-4xl text-white`}>+</Text>
            </View>
        </View>
    );
};

export default MessageInput;
