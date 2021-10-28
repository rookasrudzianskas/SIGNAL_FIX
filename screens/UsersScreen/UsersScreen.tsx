import * as React from 'react';
import {FlatList, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import tw from "tailwind-react-native-classnames";
import styles from "./style";
import ChatRoomItem from "../../components/ChatRoomItem";
import Users from "../../assets/data/Users";
import UserItem from "../../components/UserItem";
import {DataStore} from 'aws-amplify';



const UsersScreen = ({ navigation }: RootTabScreenProps<'TabOne'>)  => {

  return (
        <View style={styles.page}>

            <FlatList showsVerticalScrollIndicator={false} data={Users} renderItem={({item}) => (
                <UserItem key={item.id} user={item} />
            )}  />

        </View>
  );
}


export default UsersScreen;



