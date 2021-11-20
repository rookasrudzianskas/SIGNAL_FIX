import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import tw from "tailwind-react-native-classnames";
import {Auth, DataStore} from "aws-amplify";
import {generateKeyPair} from "../../utils/crypto";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User as UserModel} from "../../src/models";


const PUBLIC_KEY = "PUBLIC_KEY";

const SettingsScreen = () => {

    const logOut = async () => {
        await DataStore.clear();
        await Auth.signOut();
    }

    const updateKeyPair = async () => {
        // generate private and public key

        const {publicKey, secretKey} = generateKeyPair();
        // console.log(publicKey, secretKey);

        // save private key to async storage

        await AsyncStorage.setItem(PUBLIC_KEY, secretKey.toString());

        // save public key to UserModel in DataStore

        const userData = await Auth.currentAuthenticatedUser({bypassCache: true});
        const dbUser = await DataStore.query(UserModel, userData.attributes.sub);
    }


    return (
        <View style={tw`p-4`}>
                <TouchableOpacity onPress={updateKeyPair} activeOpacity={0.5} style={tw`flex bg-blue-600 px-6 py-3 items-center justify-center m-4 rounded-lg`}>
                    <Text style={tw`text-gray-100 font-bold`}>Update Key Pair</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.5} style={tw` flex bg-blue-600 px-6 py-3 items-center justify-center mx-4 rounded-lg`}>
                    <Text style={tw`text-gray-100 font-bold`}>Settings</Text>
                </TouchableOpacity>
        </View>
    );
};

export default SettingsScreen;

