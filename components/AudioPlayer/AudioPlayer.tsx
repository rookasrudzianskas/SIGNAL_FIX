import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Feather} from "@expo/vector-icons";
import styles from "../MessageInput/style";

const AudioPlayer = () => {
    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10, alignSelf: 'stretch', justifyContent: 'space-between', borderWidth: 1, borderColor: "lightgray", borderRadius: 10, overflow: 'hidden', padding: 10}}>
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
