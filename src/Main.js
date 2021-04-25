import React, { Component } from 'react'

import { SafeAreaView, View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native'

import axios from 'axios'
import pokemon from 'pokemon'
import Pokemon from './component/Pokemon'
<link rel="stylesheet" type="text/css" href="ที่เก็บ file css.css" />
const POKE_API_BASE_URL = 'https://pokeapi.co/api/v2';

export default class Main extends Component{
    constructor(props){
        super(props)

        this.state = {
            isLoding: false,
            searchInput: '',
            name:'',
            pic:'',
            types: [],
            desc:''
        }
    }
    render(){
        const{ name, pic, types, desc, searchInput, isLoding} = this.state
        
        return(
            <SafeAreaView style={styles.wrapper}>
                <View style={styles.container}>
                    <View  style={styles.headContainer}>
                        <View>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Search Pokemon"
                                onChangeText={(searchInput) => this.setState({searchInput})}
                                value={this.state.searchInput}
                            />
                        </View>
                        <View>
                            <Button
                                title="Search"
                                color="#0064e1"
                                onPress={this.searchPokemon}
                            />
                        </View>
                    </View>

                    <View style={styles.mainContainer}>
                        {isLoding && <ActivityIndicator size="large" color ="0064e1"/>}

                        {!isLoding && (
                            <Pokemon name={name} pic ={pic} types={types} desc={desc}/>
                        )}
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    searchPokemon = async () =>{
        try{
            const pokemonID = pokemon.getId(this.state.searchInput)
            this.setState({ isLoding: true})

            const { data : pokemonData } = await axios.get(`${POKE_API_BASE_URL}/pokemon/${pokemonID}`)
            const { data : pokemonSpecieData } = await axios.get(`${POKE_API_BASE_URL}/pokemon-species/${pokemonID}`)

            const{ name, sprites, types } = pokemonData
            const{ flavor_text_entries } = pokemonSpecieData

            this.setState({
                name,
                pic: sprites.front_default,
                types: this.getTypes(types),
                desc: this.getDescription(flavor_text_entries),
                isLoding: false
            })
        }catch(err){
            Alert.alert('Error','Pokemon not found');
        }
    }

    getTypes = (types) => types.map(({slot, type}) => ({
            id : slot,
            name: type.name
        }))
    getDescription = (entries) => entries.find((item) => item.language.name === 'en').flavor_text

}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5fcff'
    },
    headContainer: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 100
    },
    textInputContainer: {
        flex: 2,
    },
    buttonContainer: {
        flex:1,
        padding: 20,
        marginTop : -5
    },
    mainContainer: {
        flex: 3,
        margin: 10
    },
    textInput: {
        height: 35,
        marginBottom: 8,
        borderColor: '#ccc',
        backgroundColor: '#eaeaea',
        padding: 8,
        textAlign: 'center'
    }
})
