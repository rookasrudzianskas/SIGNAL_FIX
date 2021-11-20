import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import tw from "tailwind-react-native-classnames";

const SettingsScreen = () => {
    return (
        <View>
            <View style={tw`bg-blue-600 px-6 py-3 items-center justify-center`}>
                <Text>Settings</Text>
            </View>
        </View>
    );
};

export default SettingsScreen;
