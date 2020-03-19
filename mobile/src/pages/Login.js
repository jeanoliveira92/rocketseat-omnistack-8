import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, KeyboardAvoidingView, Image, TextInput, TouchableOpacity, AsyncStorage } from 'react-native';

import api from '../services/api';

import Logo from '../assets/logo.png';

export default function Login({ navigation }) {
    const [username, setUser] = useState('');

    useEffect(() => {

        AsyncStorage.getItem('user').then(user => {
            if (user) {
                // We have data!!
                console.log(user);
                navigation.navigate('Main', { user });
            }
        });
    }, []);

    async function handleLogin() {

        console.log("HANDLE");
        const response = await api.post('/devs', { username });

        const { _id } = response.data;

        await AsyncStorage.setItem('user', _id);

        console.log(_id);

        navigation.navigate('Main', { user: _id });
    }

    return (
        <KeyboardAvoidingView
            behavior="padding"
            style={styles.container}>

            <Image source={Logo} />
            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Digite seu usuario do Github"
                placeholderTextColor="#999"
                style={styles.input}
                value={username}
                onChangeText={setUser}
            />
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>Enviar  </Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30
    },
    input: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 4,
        marginTop: 40,
        paddingHorizontal: 15
    },
    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#DF4723',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
