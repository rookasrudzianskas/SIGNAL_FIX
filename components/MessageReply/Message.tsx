import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, ActivityIndicator, useWindowDimensions, Pressable} from 'react-native';
import tw from "tailwind-react-native-classnames";
import {Message as MessageModel, User} from "../../src/models";
import {Auth, DataStore, Storage} from "aws-amplify";
// @ts-ignore
import {S3Image} from "aws-amplify-react-native";
import AudioPlayer from "../AudioPlayer";
import {Ionicons} from "@expo/vector-icons";

const blue = '#3777f0';
const grey = 'lightgrey';
const myID = 'u1';

// @ts-ignore
const MessageReply = ({messageReply}) => {


    // @ts-ignore
    return (
        <View>
            <View style={tw`my-3 flex flex-row bg-blue-400 px-5 py-2 rounded-lg`}>
                <Text style={tw`font-bold text-gray-600`}>in reply to: </Text>
                <Text style={tw`font-bold text-gray-800`}>{messageReply}</Text>
            </View>
        </View>
    );
};

export default MessageReply;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3777f0',
        padding: 10,
        margin: 10,
        borderRadius: 10,
        // flexDirection: 'row',

        alignItems: "flex-end",

        // maxWidth: '75%',
    },
    leftContainer: {
        backgroundColor: blue,
        marginLeft: 10,
        marginRight: 'auto',
    },
    rightContainer: {
        backgroundColor: grey,
        marginLeft: 'auto',
        marginRight: 10,
    }
});


