import * as React from 'react';
import {Image, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import { RootTabScreenProps } from '../../types';
import tw from "tailwind-react-native-classnames";
import styles from "./style";
import moment from 'moment';

const ChatRoomItem = ({chatRoom}) => {
    const user = chatRoom.users[1];

    return (
        <TouchableOpacity activeOpacity={0.6}>
            <View style={tw`flex-row px-3`}>
                <View style={tw`p-3`}>
                    <Image source={{uri: user?.imageUri}} style={styles.image}/>
                    <View style={[tw`bg-blue-500 flex items-center justify-center`, {width: 20, height: 20, borderRadius: 20, position: 'absolute', left: 54, top: 10, borderWidth: 1, borderColor: 'white'}]}>
                        <Text style={[tw`text-white  font-bold`, {}]}>{chatRoom?.newMessages}</Text>
                    </View>
                </View>
                <View style={tw`flex-1 justify-center mt-4`}>
                    <View style={tw`flex-row items-center`}>
                        <View style={tw`flex flex-row flex-1`}>
                            <Text style={tw`text-xl font-bold`}>{user?.name}</Text>
                        </View>
                        <View style={tw``}>
                            <Text style={tw`text-lg text-gray-500`}>{moment(chatRoom?.lastMessage?.createdAt).fromNow()}</Text>
                        </View>
                    </View>
                    <Text numberOfLines={1} style={tw`text-lg text-gray-500 mb-5`}>{chatRoom?.lastMessage?.content}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ChatRoomItem;
