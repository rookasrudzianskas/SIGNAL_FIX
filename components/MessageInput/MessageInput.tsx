import React from 'react';
import {Text, View, StyleSheet, TextInput} from 'react-native';
import styles from "./style";

const MessageInput = () => {
    return (
        <View style={styles.root}>
            <View style={styles.inputContainer}>
                <TextInput />
            </View>
            <View style={styles.buttonContainer}>
                <Text>+</Text>
            </View>
        </View>
    );
};

export default MessageInput;
