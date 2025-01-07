// Function to get list of Pokemon abilities and pagination URLs
export async function getAbilityList(apiUrl) {
    try {
        // Make API request to the provided URL
        const res = await fetch(apiUrl);

        // If response isn't successful (not 200-299), throw error
        if (!res.ok) throw Error("Failed getting Data");

        // Parse JSON response into JavaScript object
        const data = await res.json();

        // Extract pagination URLs for next and previous pages
        const nextAbilitiesUrl = data.next;
        const previousAbilitiesUrl = data.previous;

        // Map through results to get just the ability names
        const abilityList = data.results.map((item) => item.name);

        // Combine ability names and pagination URLs into single array
        const abilityDetails = [abilityList, nextAbilitiesUrl, previousAbilitiesUrl]

        // Return the combined array
        return abilityDetails;
    } catch (error) {
        // Log any errors that occur during the process
        console.error(error);
        // Return empty array if there's an error
        return [];
    }
}

// Function to get detailed information about a specific ability and related Pokemon's
export async function getAbilityDetail(id) {
    // Make API request to get specific ability details
    const res = await fetch(`https://pokeapi.co/api/v2/ability/${id}`);

    // Check for successful response
    if (!res.ok) throw Error("Failed getting Data");

    // Parse the ability data
    const abilityDetail = await res.json();

    // Extract URLs for all Pokemon that have this ability
    const pokemonListUrls = abilityDetail.pokemon.map(pokemon => pokemon.pokemon.url);

    // Create array of promises to fetch each Pokemon's details
    const fetchAllUrl = pokemonListUrls.map(url =>
        fetch(url)
            // Convert response to JSON
            .then(response => response.json())
            // Transform Pokemon data into simplified format
            .then(pokemonData => ({
                name: pokemonData.name,
                sprite: getPokemonSprite(pokemonData.sprites),
                abilities: pokemonData.abilities.map(ability => ({
                    name: ability.ability.name,
                }))
            }))
    );

    // Wait for all Pokemon data to be fetched
    return Promise.all(fetchAllUrl)
        // Combine ability name with Pokemon list
        .then(pokemonList => ({
            name: abilityDetail.name,
            pokemonList
        }))
        // Handle any errors during the process
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error;
        });
}

// Helper function to find first available sprite from Pokemon's sprite options
function getPokemonSprite(sprites) {
    // Create array of all possible sprite URLs
    const spriteOptions = [
        sprites.back_default,
        sprites.back_female,
        sprites.back_shiny,
        sprites.back_shiny_female,
        sprites.front_default,
        sprites.front_female,
        sprites.front_shiny,
        sprites.front_shiny_female,
    ];

    // Return first non-null sprite URL, or empty string if none found
    return spriteOptions.find(sprite => sprite !== null) || '';
}