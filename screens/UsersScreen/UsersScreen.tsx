import * as React from 'react';
import {FlatList, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import tw from "tailwind-react-native-classnames";
import styles from "./style";
import ChatRoomItem from "../../components/ChatRoomItem";
import UserItem from "../../components/UserItem";
import {DataStore} from 'aws-amplify';
import {useState} from "react";
import {User} from "../../src/models";



const UsersScreen = ({ navigation }: RootTabScreenProps<'TabOne'>)  => {

    const [users, setUsers] = useState<User[]>([]);

  return (
        <View style={styles.page}>

            <FlatList showsVerticalScrollIndicator={false} data={users} renderItem={({item}) => (
                <UserItem key={item.id} user={item} />
            )}  />

        </View>
  );
}


export default UsersScreen;



