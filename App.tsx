import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Amplify, {DataStore, Hub} from 'aws-amplify';
import config from './src/aws-exports';
// @ts-ignore
import { withAuthenticator } from 'aws-amplify-react-native';
import {Picker} from '@react-native-picker/picker';
import {Message, User} from './src/models';


Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});

const App = () => {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [user, setUser] = useState<User|null>(null);


 useEffect(() => {
   // Create listener
   const listener = Hub.listen('datastore', async (hubData) => {
     const  { event, data } = hubData.payload;
       if (event === "outboxMutationProcessed"
           && data.model === Message
           && !(["DELIVERED", "READ"].includes(data.element.status))) {
           // console.log('Mutation was synced with the cloud' + data);
           // set the message status to delivered
           //   console.log('This is working 🔥');
            // @ts-ignore
           await DataStore.save(Message.copyOf(data.element, (updated) => {
               //@ts-ignore
               updated.status = "DELIVERED";
            })
           );
       }
   });

// Remove listener
   return () => listener();
 }, []);


  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

export default withAuthenticator(App);
