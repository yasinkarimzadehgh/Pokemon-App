import { Link } from 'react-router-dom';
import './AbilityList.css';

function AbilityList({
    abilityList,
    fetchPokemonAbilities,
    deletePokemonAbilities,
    apiUrl,
    currentOffset,
    isLastPage
}) {
    // Calculate whether to show the "Show Less" button
    // Only shows when we have more than 10 items and offset > 10
    const shouldShowLess = abilityList.length > 10 && currentOffset > 10;

    return (
        // Main container for the ability list
        <div className='abilityList'>
            {/* Page title */}
            <h1 className='abilityList-title'>Pokemon Abilities</h1>

            {/* Conditional rendering based on whether data is loaded */}
            {abilityList.length > 0 ? (
                // If abilities exist, render the list
                <ul className='abilityList-main'>
                    {/* Map through each ability name and create a link */}
                    {abilityList.map((name, index) => {
                        // Format the ability name:
                        // 1. Replace hyphens with spaces
                        // 2. Capitalize first letter of each word
                        const formattedName = name
                            .replace(/-/g, ' ')
                            .replace(/\b\w/g, char => char.toUpperCase());

                        // Return a Link component for each ability
                        return (
                            <Link
                                key={index}
                                to={`/ability/${index + 1}`}
                                className="abilityList-item"
                            >
                                {formattedName}
                            </Link>
                        );
                    })}
                </ul>
            ) : (
                // If no abilities are loaded yet, show loading message
                <p>Loading...</p>
            )}

            {/* Container for pagination control buttons */}
            <div className="abilityList-controls">
                {/* Show Less button - only appears if shouldShowLess is true */}
                {shouldShowLess && (
                    <button
                        onClick={deletePokemonAbilities}
                        className="show-less"
                    >
                        Show Less
                    </button>
                )}

                {/* Show More button - appears if not on last page */}
                {!isLastPage && (
                    <button
                        onClick={fetchPokemonAbilities}
                        className="show-more"
                    >
                        Show More
                    </button>
                )}
            </div>
        </div>
    );
}

export default AbilityList;