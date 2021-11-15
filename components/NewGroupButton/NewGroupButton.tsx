import React from 'react';
import {Text, View, StyleSheet, Pressable, TouchableOpacity} from 'react-native';

const NewGroupButton = () => {
    return (
        <TouchableOpacity activeOpacity={0.5}>
            <View>
                <Text>New Group</Text>
            </View>
        </TouchableOpacity>
    );
};

export default NewGroupButton;
