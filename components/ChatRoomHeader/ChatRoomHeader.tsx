import {Image, Text, useWindowDimensions, View} from "react-native";
import tw from "tailwind-react-native-classnames";
import {Entypo, Feather} from "@expo/vector-icons";
import * as React from "react";
import {useRoute} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {Auth, DataStore} from "aws-amplify";
import {ChatRoom, ChatRoomUser, User} from "../../src/models";
import moment from "moment";

// @ts-ignore
const ChatRoomHeader = ({id, children}) => {

    const {width, height} = useWindowDimensions();
    const [user, setUser] = useState<User|null>(null); // the display user
    const [chatRoom, setChatRoom] = useState<ChatRoom|undefined>(undefined);
    const [allUsers, setAllUsers] = useState<User[]>([]);


    const fetchUsers = async () => {
        const fetchedUsers = (await DataStore.query(ChatRoomUser))
            .filter(chatRoomUser => chatRoomUser.chatroom.id === id)
            .map(chatRoomUser => chatRoomUser.user);

        setAllUsers(fetchedUsers);

        const authUser = await Auth.currentAuthenticatedUser();
        setUser(fetchedUsers.find(user => user.id !== authUser.attributes.sub) || null);
    };

    const fetchChatRoom = async () => {
        DataStore.query(ChatRoom, id).then(setChatRoom);
    };

    useEffect(() => {
        if(!id) {
            return;
        }

        fetchUsers();
        fetchChatRoom();
    }, []);

    const getLastOnlineText = () => {
        if(!user?.lastOnlineAt) {
            return null;
        }
        // if last online is less than 5 minutes, show him as online, otherwise offline
        const lastOnlineDiffMS = moment().diff(moment(user.lastOnlineAt));
        if(lastOnlineDiffMS < 5 * 60 * 1000) {
            // less than 5 minutes
            return 'Online';
        } else {
            return `Last seen online ${moment(user.lastOnlineAt).fromNow()}`;
        }
            // console.log(moment().diff(moment(user.lastOnlineAt)));

        // }
    }

    const getUsernames = () => {
        return allUsers.map(user => user.name).join(', ');
    }

    const isGroup = allUsers.length > 2;




    // console.log('This is image uri', chatRoom?.imageUri);
    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: -50, paddingRight: 10, alignItems: 'center'}}>
            {/*<Text>Rokas</Text>*/}
            <View style={tw`flex-row`}>
                <View style={tw``}>
                    <Image source={{ uri: chatRoom?.imageUri || user?.imageUri }} style={{width: 30, height: 30, borderRadius: 30, marginRight: -200}} />
                </View>
                <View style={tw`flex-1 ml-10`}>
                    <View style={tw`flex-col justify-center`}>
                        <Text numberOfLines={1} style={{ fontSize: 19, fontWeight: '600', marginTop: -6}}>{chatRoom?.name ? chatRoom.name : user?.name}</Text>
                        <View style={tw`flex flex-row items-center `}>
                            <Text style={{ fontSize: 12, fontWeight: '400', }}>{isGroup ? getUsernames() : getLastOnlineText()}
                            </Text>
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
