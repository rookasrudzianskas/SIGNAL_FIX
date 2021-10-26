import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
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

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3777f0',
        padding: 10,
        margin: 10,
        borderRadius: 10,
        maxWidth: '75%',
    },
    leftContainerMe: {
        backgroundColor: ,
        marginLeft: ,
        marginRight: ,
    },
    rightContainer: {
        marginRight: ,
    }
});


