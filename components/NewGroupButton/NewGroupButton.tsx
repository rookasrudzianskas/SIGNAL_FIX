import React from 'react';
import {Text, View, StyleSheet, Pressable, TouchableOpacity} from 'react-native';
import {FontAwesome} from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";

// @ts-ignore
const NewGroupButton = ({onPress}) => {
    return (
        <View >
            <View style={tw`flex flex-row p-4 items-center`}>
                <FontAwesome style={tw`flex-1`} name="group" size={24} color="#4f4f4f" />
                <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
                    <Text style={tw`ml-5 font-bold`}>New Group</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default NewGroupButton;
