import React from 'react';
import {Text, View, StyleSheet, Pressable, TouchableOpacity} from 'react-native';
import {FontAwesome} from "@expo/vector-icons";

const NewGroupButton = () => {
    return (
        <TouchableOpacity activeOpacity={0.5}>
            <View>
                <FontAwesome name="group" size={24} color="black" />
                <Text>New Group</Text>
            </View>
        </TouchableOpacity>
    );
};

export default NewGroupButton;
