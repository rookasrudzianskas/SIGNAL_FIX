import {Feather, FontAwesome} from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {NavigationContainer, DefaultTheme, DarkTheme, useNavigation} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import {ColorSchemeName, Image, Pressable, TouchableOpacity, useWindowDimensions, View} from 'react-native';
import NotFoundScreen from '../screens/NotFoundScreen';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import ChatRoomScreen from "../screens/ChatRoomScreen/ChatRoomScreen";
import {Text} from 'react-native';
import {Component} from "react";
import tw from "tailwind-react-native-classnames";
import {Auth} from "aws-amplify";
import UsersScreen from "../screens/UsersScreen/UsersScreen";
import ChatRoomHeader from "../components/ChatRoomHeader";

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  // @ts-ignore
    return (
    <Stack.Navigator  screenOptions={{
        headerBackTitleVisible: false
    }} initialRouteName={'HomeScreen'} >
        <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerTitle: props => <HomeHeader /> }}
        />

        <Stack.Screen
            name="UsersScreen"
            component={UsersScreen}
            options={{ title: 'Users 🚀' }}
        />

        <Stack.Screen name="ChatRoomScreen" component={ChatRoomScreen}
                      options={({route}) => ({
                          //@ts-ignore
                          headerTitle: () => <ChatRoomHeader id={route?.params?.id} />,
                              headerBackTitleVisible: false,
                          })}
        />
        <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

//@ts-ignore
const HomeHeader = (props) => {

    const {width, height} = useWindowDimensions();
    const navigation = useNavigation();

    const onPress = () => {
        Auth.signOut();
    }

    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width, paddingHorizontal: 10, alignItems: 'center'}}>
            <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
                <Image source={{uri: 'https://avatars.githubusercontent.com/u/38469892?v=4'}} style={{width: 30, height: 30, borderRadius: 30}} />
            </TouchableOpacity>
            <Text style={{flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '600', marginLeft: 40,}}>Signal</Text>
            <View style={tw`mr-6 flex-row`}>
                <Feather style={tw`mr-4`} name="camera" size={24} color="black" />
                <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('UsersScreen')} >
                    <Feather name="edit-2" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

