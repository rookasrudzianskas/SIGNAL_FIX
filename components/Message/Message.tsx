import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, ActivityIndicator, useWindowDimensions} from 'react-native';
import tw from "tailwind-react-native-classnames";
import {User} from "../../src/models";
import {Auth, DataStore} from "aws-amplify";
// @ts-ignore
import {S3Image} from "aws-amplify-react-native";

const blue = '#3777f0';
const grey = 'lightgrey';
const myID = 'u1';

// @ts-ignore
const Message = ({message}) => {
    const [user, setUser] = useState<User|undefined>();
    const [isMe, setIsMe] = useState<boolean>(false);
    const { width } = useWindowDimensions();


    useEffect(() => {
        // @ts-ignore
        DataStore.query(User, message.userID).then(setUser);
    }, []);

    useEffect(() => {
        const checkIfMe = async () => {
            if(!user) {
                return;
            }
            const authUser = await Auth.currentAuthenticatedUser();
            setIsMe(user.id === authUser.attributes.sub);
        }
        checkIfMe();
    }, [user]);

    if(!user) {
        return (
            <View style={tw`flex items-center justify-center mt-10`}>
                <ActivityIndicator style={tw` items-center justify-center`} color={'lightblue'} size={'large'} />
            </View>
        )
    }


    return (
        <View style={[styles.container, isMe ? styles.rightContainer : styles.leftContainer]}>
            {message.image && (
                <S3Image
                    style={{ width: width * 0.7, aspectRatio: 4 / 3 }}
                    imgKey={message.image}
                    theme={'dark'}
                    level={'public'}
                />
            )}
            <Text style={{color: isMe ? 'black' : 'white'}}>
                {message?.content}
            </Text>
        </View>
    );
};

export default Message;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3777f0',
        padding: 10,
        margin: 10,
        borderRadius: 10,
        maxWidth: '75%',
    },
    leftContainer: {
        backgroundColor: blue,
        marginLeft: 10,
        marginRight: 'auto',
    },
    rightContainer: {
        backgroundColor: grey,
        marginLeft: 'auto',
        marginRight: 10,
    }
});


