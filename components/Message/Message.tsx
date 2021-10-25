import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import styles from './style';
import tw from "tailwind-react-native-classnames";

const Message = () => {
    return (
        <View style={styles.container}>
            <Text style={tw``}>
                byrookas 🚀
            </Text>
        </View>
    );
};

export default Message;
