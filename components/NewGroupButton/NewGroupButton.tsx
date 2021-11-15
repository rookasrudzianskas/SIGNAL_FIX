import React from 'react';
import {Text, View, StyleSheet, Pressable, TouchableOpacity} from 'react-native';
import {FontAwesome} from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";

const NewGroupButton = () => {
    return (
        <TouchableOpacity activeOpacity={0.5}>
            <View style={tw`flex flex-row p-4 items-center`}>
                <FontAwesome style={tw`flex-1`} name="group" size={24} color="gray" />
                <Text style={tw`ml-5 font-bold`}>New Group</Text>
            </View>
        </TouchableOpacity>
    );
};

export default NewGroupButton;
