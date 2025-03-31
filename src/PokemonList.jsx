// src/components/PokemonList.jsx
import { useState, useEffect } from 'react';

function PokemonList() {
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);

    // useEffect to handle component mounting
    useEffect(() => {

        const fetchPokemonData = async () => {
        
                const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=5');

                if (!response.ok) {
                    throw new Error('Pokemon fetch did not work');
                }

                const pokemonData = await response.json();

                // when the state is changed, this is where the updating phase happens. 
                setPokemon(pokemonData.results); // .results is where the array of pokemon exists
                
                // this will unmount the "Loading Pokemon..." message
                setLoading(false); 
        }

        fetchPokemonData();        

    }, []); // Empty dependency array ensures this runs once after the component is mounted

    // when loading is no longer true, this message will unmount and no longer display
    if (loading) {
        return <div>Loading Pokemon...</div>;
    }

    return (
        <div>
            <h1>List of Pokemon</h1>
            <ul>
                {pokemon.map(poke => (
                    <li key={poke.name}>
                        <p>{poke.name}</p>
                        <img src={`https://img.pokemondb.net/artwork/${poke.name}.jpg`} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PokemonList;