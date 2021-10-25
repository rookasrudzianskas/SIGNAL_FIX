import * as React from 'react';
import {Image, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import { RootTabScreenProps } from '../../types';
import tw from "tailwind-react-native-classnames";
import styles from "./style";

const ChatRoomItem = (props) => {
    return (
        <TouchableOpacity activeOpacity={0.6}>
            <View style={tw`flex-row px-3`}>
                <View style={tw`p-3`}>
                    <Image source={{uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/elon.png'}} style={styles.image}/>
                    <View style={[tw`bg-blue-500 flex items-center justify-center`, {width: 20, height: 20, borderRadius: 20, position: 'absolute', left: 54, top: 10, borderWidth: 1, borderColor: 'white'}]}>
                        <Text style={[tw`text-white  font-bold`, {}]}>4</Text>
                    </View>
                </View>
                <View style={tw`flex-1 justify-center mt-4`}>
                    <View style={tw`flex-row items-center`}>
                        <View style={tw`flex flex-row flex-1`}>
                            <Text style={tw`text-xl font-bold`}>Rokas Rudzianskas</Text>
                        </View>
                        <View style={tw``}>
                            <Text style={tw`text-lg text-gray-500`}>11:11AM</Text>
                        </View>
                    </View>
                    <Text numberOfLines={1} style={tw`text-lg text-gray-500 mb-5`}>Hola Hola Hola Ola!fsdfsafdsfsdfsdfdsfsdfsdhfsdkfsdjkfjsdklf</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ChatRoomItem;
