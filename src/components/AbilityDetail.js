// Import necessary hooks and functions
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAbilityDetail } from '../services/apiPokemon';
import './AbilityDetail.css';
import 'animate.css';

function AbilityDetail({ abilityList }) {
    // Get ability ID from URL parameters
    const { id } = useParams();
    const abilityId = parseInt(id, 10); // Convert ID to number

    // State management
    const [abilityDetail, setAbilityDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comingSoonMessage, setComingSoonMessage] = useState('');

    // Hook for programmatic navigation
    const navigate = useNavigate();

    // Effect to fetch ability details when component mounts or ID changes
    useEffect(() => {
        const fetchPokemonAbilities = async () => {
            // Check if ability ID is beyond available range
            if (abilityId > 307) {
                setComingSoonMessage('This ability is coming soon!');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await getAbilityDetail(abilityId);
                setAbilityDetail(data);
            } catch (error) {
                console.error("Error fetching ability details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemonAbilities();
    }, [abilityId]);

    // Helper function to format Pokemon names
    const formatName = (name) => {
        return name
            ? name.replace(/-/g, ' ')  // Replace hyphens with spaces
                .replace(/\b\w/g, char => char.toUpperCase()) // Capitalize words
            : '';
    };

    // Navigation handler functions
    const handleBack = () => navigate('/ability');
    const handlePrev = () => navigate(`/ability/${abilityId - 1}`);
    const handleNext = () => navigate(`/ability/${abilityId + 1}`);

    // Navigation button disable conditions
    const isPrevDisabled = abilityId <= 1;
    const isNextDisabled = abilityId >= abilityList.length;

    return (
        <div className='ability-detail-container'>
            {loading ? (
                // Loading state
                <div className="loader">
                    <span>Loading...</span>
                </div>
            ) : (
                comingSoonMessage ? (
                    // Coming soon message for unavailable abilities
                    <div className="coming-soon-message">
                        <h2>{comingSoonMessage}</h2>
                        <button onClick={handleBack} className='back-button'>
                            Back To Ability List
                        </button>
                    </div>
                ) : (
                    abilityDetail && (
                        // Main content when ability details are loaded
                        <>
                            {/* Header section with navigation */}
                            <div className='ability-header'>
                                <button onClick={handleBack} className='back-button'>
                                    Back To Ability List
                                </button>
                                <h2 className='ability-name'>
                                    {formatName(abilityDetail.name)}
                                </h2>
                                <div className='navigation-buttons'>
                                    {/* Previous ability button */}
                                    {!isPrevDisabled && (
                                        <button
                                            onClick={handlePrev}
                                            className='prev-button'
                                        >
                                            Previous Ability
                                        </button>
                                    )}
                                    {/* Next ability button */}
                                    {!isNextDisabled && (
                                        <button
                                            onClick={handleNext}
                                            className='next-button'
                                        >
                                            Next Ability
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Pokemon list table */}
                            <div className='pokemon-list-container'>
                                <h3 className='pokemon-list-title'>
                                    List of Pokémon's with this Ability:
                                </h3>
                                <table className='pokemon-table'>
                                    <thead className='pokemon-table-header'>
                                        <tr>
                                            <th>Name</th>
                                            <th>Image</th>
                                            <th>Other Abilities of this Pokémon</th>
                                        </tr>
                                    </thead>
                                    <tbody className='pokemon-table-body'>
                                        {/* Map through Pokemon list */}
                                        {abilityDetail.pokemonList.map((pokemon, index) => (
                                            <tr key={index}>
                                                <td>{formatName(pokemon.name)}</td>
                                                <td>
                                                    <img
                                                        src={pokemon.sprite}
                                                        alt={pokemon.name}
                                                        className="pokemon-sprite"
                                                    />
                                                </td>
                                                <td>
                                                    {/* Filter and format other abilities */}
                                                    {pokemon.abilities
                                                        .filter(ability => ability.name !== abilityDetail.name)
                                                        .map(ability => formatName(ability.name))
                                                        .join(', ')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )
                )
            )}
        </div>
    );
}

export default AbilityDetail;