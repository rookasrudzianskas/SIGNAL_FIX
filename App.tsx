import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Amplify, {Hub} from 'aws-amplify';
import config from './src/aws-exports';
// @ts-ignore
import { withAuthenticator } from 'aws-amplify-react-native';
import {Picker} from '@react-native-picker/picker';


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
     if (event === 'networkStatus') {
       console.log(`User has a network connection: ${data.active}`)
     }
     if(event === 'outboxMutationProcessed'){
       console.log('User is outboxMutationProcessed')
     }
   })

// Remove listener
   listener();
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
