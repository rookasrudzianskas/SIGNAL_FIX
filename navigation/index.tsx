/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {Feather, FontAwesome} from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import {ColorSchemeName, Image, Pressable, View} from 'react-native';
import NotFoundScreen from '../screens/NotFoundScreen';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import ChatRoomScreen from "../screens/ChatRoomScreen/ChatRoomScreen";
import {Text} from 'react-native';
import {Component} from "react";

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
  return (
    <Stack.Navigator  initialRouteName={'HomeScreen'} >
        <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerTitle: props => <HomeHeader /> }}
        />
        <Stack.Screen name="ChatRoomScreen" component={ChatRoomScreen} />
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
    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '90%'}}>
            <Image source={{uri: 'https://avatars.githubusercontent.com/u/38469892?v=4'}} style={{width: 30, height: 30, borderRadius: 30}} />
            <Text style={{}}>Home</Text>
            <Feather name="camera" size={24} color="black" />
            <Feather name="edit-2" size={24} color="black" />
        </View>
    )
}
