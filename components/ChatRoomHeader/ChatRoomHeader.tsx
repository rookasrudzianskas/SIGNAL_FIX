import {Image, Text, useWindowDimensions, View} from "react-native";
import tw from "tailwind-react-native-classnames";
import {Feather} from "@expo/vector-icons";
import * as React from "react";
import {useRoute} from "@react-navigation/native";

// @ts-ignore
const ChatRoomHeader = (props) => {

    const {width, height} = useWindowDimensions();

    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: -50, paddingRight: 10, alignItems: 'center'}}>
            {/*<Text>Rokas</Text>*/}
            <Image source={{uri: 'https://avatars.githubusercontent.com/u/38469892?v=4'}} style={{width: 30, height: 30, borderRadius: 30, marginRight: -200}} />
            <Text style={{flex: 1, textAlign: 'right', marginRight: 70, fontSize: 20, fontWeight: '600',}}>{props?.children}</Text>
            <View style={tw`mr-6 flex-row mr-16`}>
                <Feather style={tw`mr-4`} name="camera" size={24} color="black" />
                <Feather name="edit-2" size={24} color="black" />
            </View>
        </View>
    )
}

export default ChatRoomHeader;
