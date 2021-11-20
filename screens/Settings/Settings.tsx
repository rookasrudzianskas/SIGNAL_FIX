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
        <View style={tw`p-4`}>
                <View style={tw`flex bg-blue-600 px-6 py-3 items-center justify-center m-4 rounded-lg`}>
                    <Text style={tw`text-gray-100 font-bold`}>Log out</Text>
                </View>

                <View style={tw` flex bg-blue-600 px-6 py-3 items-center justify-center mx-4 rounded-lg`}>
                    <Text style={tw`text-gray-100 font-bold`}>Settings</Text>
                </View>
        </View>
    );
};

export default SettingsScreen;
