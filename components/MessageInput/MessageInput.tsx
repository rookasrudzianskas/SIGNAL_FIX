import React, {useState} from 'react';
import {Text, View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import styles from "./style";
import tw from "tailwind-react-native-classnames";
import {AntDesign, Feather, Ionicons, MaterialCommunityIcons, SimpleLineIcons} from "@expo/vector-icons";

const MessageInput = () => {
    const [message, setMessage] = useState('');


    return (
        <View style={styles.root}>
            <View style={styles.inputContainer}>
                <SimpleLineIcons name="emotsmile" size={24} color="#595959" style={{marginHorizontal: 5,}} />

                <TextInput
                    style={{flex: 1, marginHorizontal: 5,}}
                    placeholder="Type a message here"
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                />

                <Feather name="camera" size={24} color="#595959" />
                <MaterialCommunityIcons style={{marginHorizontal: 5,}} name="microphone-outline" size={24} color="#595959" />
            </View>
            <TouchableOpacity  style={styles.buttonContainer}>
                {message ? (
                    <Ionicons name="ios-send" size={18} color="white" />
                ) : (
                    <AntDesign name="plus" size={24} color="white" />
                )}
            </TouchableOpacity>
        </View>
    );
};

export default MessageInput;
