import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Amplify, {DataStore, Hub} from 'aws-amplify';
import config from './src/aws-exports';
// @ts-ignore
import { withAuthenticator } from 'aws-amplify-react-native';
import {Picker} from '@react-native-picker/picker';
import Message from "./components/Message";


Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});

const App = () => {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

 useEffect(() => {
   // Create listener
   const listener = Hub.listen('datastore', async hubData => {
     const  { event, data } = hubData.payload;
     // console.log(event);
     // console.log(data);
     // console.log('datastore')
     if (event === 'networkStatus') {
       console.log(`User has a network connection: ${data.active}`)
     }
     if(event === 'outboxMutationProcessed'){
       console.log('Mutation was synced with the cloud' + data);
       if(data.model === Message) {
         // set the message status to delivered
            // @ts-ignore
           await DataStore.save(Message.copyOf(data.element, (updated) => {
               updated.status = "DELIVERED"
            })
           );
         }
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
