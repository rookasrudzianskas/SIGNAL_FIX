import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Feather} from "@expo/vector-icons";
import styles from "../MessageInput/style";
import {Audio, AVPlaybackStatus} from "expo-av";

// @ts-ignore
const AudioPlayer = ({soundURI}) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [paused, setPaused] = useState(true);
    const [audioProgress, setAudioProgress] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);


    useEffect(() => {
        loadSound();
        () => {
            // unload sound
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [soundURI]);

    const loadSound = async () => {
        if (!soundURI) {
            return;
        }

        const { sound } = await Audio.Sound.createAsync(
            { uri: soundURI },
            {},
            onPlaybackStatusUpdate
        );
        setSound(sound);
    };

    // Audio
    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (!status.isLoaded) {
            return;
        }
        setAudioProgress(status.positionMillis / (status.durationMillis || 1));
        setPaused(!status.isPlaying);
        setAudioDuration(status.durationMillis || 0);
    };

    const playPauseSound = async () => {
        if (!sound) {
            return;
        }
        if (paused) {
            await sound.playFromPositionAsync(0);
        } else {
            await sound.pauseAsync();
        }
    };

    const getDuration = () => {
        const minutes = Math.floor(audioDuration / (60 * 1000));
        const seconds = Math.floor((audioDuration % (60 * 1000)) / 1000);

        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10, alignSelf: 'stretch', justifyContent: 'space-between', borderWidth: 1, borderColor: "lightgray", borderRadius: 10, overflow: 'hidden', padding: 10, backgroundColor: 'white'}}>
                <TouchableOpacity activeOpacity={0.6} onPress={playPauseSound}>
                    <Feather name={paused ? 'play' : 'pause'} size={24} color="gray" style={{}} />
                </TouchableOpacity>

                <View style={styles.audioProgressBG}>
                    <View style={{
                        width: 10,
                        height: 10,
                        borderRadius: 10,
                        backgroundColor: '#3777f0',
                        position: 'absolute',
                        top: -3,
                        left: `${audioProgress * 100}%`,
                    }}>

                    </View>
                </View>
                <Text>{getDuration()}</Text>
            </View>
        </View>
    );
};

export default AudioPlayer;


