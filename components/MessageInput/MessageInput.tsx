import React from 'react';
import {Text, View, StyleSheet, TextInput} from 'react-native';
import styles from "./style";
import tw from "tailwind-react-native-classnames";
import {SimpleLineIcons} from "@expo/vector-icons";

const MessageInput = () => {
    return (
        <View style={styles.root}>
            <View style={styles.inputContainer}>
                <SimpleLineIcons name="emotsmile" size={24} color="grey" />
                <TextInput style={{flex: 1,}} />
            </View>
            <View style={styles.buttonContainer}>
                <Text style={tw`text-4xl text-white`}>+</Text>
            </View>
        </View>
    );
};

export default MessageInput;
