import {Image, Text, useWindowDimensions, View} from "react-native";
import tw from "tailwind-react-native-classnames";
import {Entypo, Feather} from "@expo/vector-icons";
import * as React from "react";
import {useRoute} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {Auth, DataStore} from "aws-amplify";
import {ChatRoomUser, User} from "../../src/models";
import moment from "moment";

// @ts-ignore
const ChatRoomHeader = ({id, children}) => {

    const {width, height} = useWindowDimensions();
    const [user, setUser] = useState<User|null>(null); // the display user


    useEffect(() => {
        if(!id) {
            return;
        }

        const fetchUsers = async () => {
            const fetchedUsers = (await DataStore.query(ChatRoomUser))
                .filter(chatRoomUser => chatRoomUser.chatroom.id === id)
                .map(chatRoomUser => chatRoomUser.user);

            // setUsers(fetchedUsers);

            const authUser = await Auth.currentAuthenticatedUser();
            setUser(fetchedUsers.find(user => user.id !== authUser.attributes.sub) || null);
        };
        fetchUsers();
    }, []);

    const getLastOnlineText = () => {
        if(!user?.lastOnlineAt) {
            return null;
        }
        // if last online is less than 5 minutes, show him as online, otherwise offline
        // if(moment(user.lastOnlineAt).diff(moment())) {
            console.log(moment(user.lastOnlineAt).diff(moment()));

        // }
    }

    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: -50, paddingRight: 10, alignItems: 'center'}}>
            {/*<Text>Rokas</Text>*/}
            <View style={tw`flex-row`}>
                <View style={tw``}>
                    <Image source={{uri: user?.imageUri}} style={{width: 30, height: 30, borderRadius: 30, marginRight: -200}} />
                </View>
                <View style={tw`flex-1 ml-10`}>
                    <View style={tw`flex-col justify-center`}>
                        <Text style={{ fontSize: 20, fontWeight: '600', marginTop: -6}}>{user?.name}</Text>
                        <View style={tw`flex flex-row items-center `}>
                            <Text style={{ fontSize: 12, fontWeight: '400', }}>{getLastOnlineText()}</Text>
                            <Entypo name="dot-single" size={24} color={!user?.lastOnlineAt ? 'red' : 'green'} />
                        </View>
                    </View>
                </View>
                <View style={tw``}>
                    <View style={tw`mr-6 flex-row mr-16`}>
                        <Feather style={tw`mr-4`} name="camera" size={24} color="black" />
                        <Feather name="edit-2" size={24} color="black" />
                    </View>
                </View>
            </View>
        </View>
    )
}

export default ChatRoomHeader;
