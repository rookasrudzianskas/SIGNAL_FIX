import React, {useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {ChatRoom} from "../../src/models";

const GroupInfoScreen = () => {

    const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);

    return (
        <View>
            <Text>
                byrookas 🚀
            </Text>
        </View>
    );
};

export default GroupInfoScreen;
