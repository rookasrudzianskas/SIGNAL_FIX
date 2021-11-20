import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Amplify, {Auth, DataStore, Hub} from 'aws-amplify';
import config from './src/aws-exports';
// @ts-ignore
import { withAuthenticator } from 'aws-amplify-react-native';
import {Picker} from '@react-native-picker/picker';
import {Message, User} from './src/models';
import moment from "moment";
import {ActionSheetProvider} from "@expo/react-native-action-sheet";
import { secretbox, randomBytes } from "tweetnacl";
import {
    decodeUTF8,
    encodeUTF8,
    encodeBase64,
    decodeBase64
} from "tweetnacl-util";
import * as Random from 'expo-random';




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

    console.log(randomBytes(secretbox.nonceLength));


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

    useEffect(() => {
        if (!user) {
            return;
        }

        const subscription = DataStore.observe(User, user.id).subscribe((msg) => {
            if (msg.model === User && msg.opType === "UPDATE") {
                setUser(msg.element);
            }
        });

        return () => subscription.unsubscribe();
    }, [user?.id]);

 useEffect(() => {
     fetchUser();
 }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            await updateLastOnline();
        }, 1 * 60 * 1000);
        return () => clearInterval(interval);
    }, [user]);

    const fetchUser = async () => {
        const userData = await Auth.currentAuthenticatedUser();
        const user = await DataStore.query(User, userData.attributes.sub);
        if (user) {
            setUser(user);
        }
    };

    const updateLastOnline = async () => {
        // const userData = await Auth.currentAuthenticatedUser();
        // const user = await DataStore.query(User, userData.attributes.sub);

        if (!user) {
            return;
        }

        const response = await DataStore.save(
            User.copyOf(user, (updated) => {
                updated.lastOnlineAt = +new Date();
            })
        );
        setUser(response);
    };

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
          <>
              <ActionSheetProvider>
                  <>
                      <Navigation colorScheme={colorScheme} />
                      <StatusBar />
                  </>
              </ActionSheetProvider>
          </>
      </SafeAreaProvider>
    );
  }
}

export default withAuthenticator(App);
