import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import tw from "tailwind-react-native-classnames";
import {Auth, DataStore} from "aws-amplify";

const SettingsScreen = () => {

    const logOut = async () => {
        await DataStore.clear();
        await Auth.signOut();
    }


    return (
        <View>
            <View style={tw`bg-blue-600 px-6 py-3 items-center justify-center`}>
                <Text>Log out</Text>
            </View>

            <View style={tw`bg-blue-600 px-6 py-3 items-center justify-center`}>
                <Text>Settings</Text>
            </View>
        </View>
    );
};

export default SettingsScreen;
