import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
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
    },
    buttonContainer: {
        width: 50,
        height: 50,
        backgroundColor: '#3777f0',
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default styles;
