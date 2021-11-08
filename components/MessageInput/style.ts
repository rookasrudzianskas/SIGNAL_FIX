import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    root: {
        padding: 10,
    },
    inputContainer: {
        backgroundColor: '#f2f2f2',
        flex: 1,
        marginRight: 10,
        borderRadius: 25,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#dedede',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    buttonContainer: {
        width: 40,
        height: 40,
        backgroundColor: '#3777f0',
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
    },
    audioProgressBG: {
        flex: 1,
        height: 3,
        backgroundColor: 'lightgray',
        borderRadius: 5,
        margin: 10,
    },
});

export default styles;
