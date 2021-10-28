import * as React from 'react';
import {Image, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import { RootTabScreenProps } from '../../types';
import tw from "tailwind-react-native-classnames";
import styles from "./style";
import moment from 'moment';
import {useNavigation} from "@react-navigation/native";
import {ChatRoom} from "../../src/models";
import {DataStore} from "aws-amplify";

// @ts-ignore
const UserItem = ({user}) => {

    const navigation = useNavigation();
    const onPress = () => {
        // @ts-ignore
        // create a chatroom with him
    //    @TODO
        const newChatRoom = await DataStore.save(new ChatRoom({newMessages: {}}));


    }

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
            <View style={tw`flex-row px-3 items-center justify-center`}>
                <View style={tw`p-3`}>
                    <Image source={{uri: user?.imageUri}} style={styles.image}/>
                </View>
                <View style={tw`flex-1 justify-center`}>
                    <View style={tw`flex-row items-center`}>
                        <View style={tw`flex flex-row flex-1`}>
                            <Text style={tw`text-xl font-bold`}>{user?.name}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default UserItem;
