import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AbilityList from './components/AbilityList';
import AbilityDetail from './components/AbilityDetail';
import { useEffect, useState } from 'react';
import { getAbilityList } from './services/apiPokemon';

function App() {
  // State to store the current API URL, initialized with base URL showing 10 items
  const [apiUrl, setApiUrl] = useState('https://pokeapi.co/api/v2/ability/?offset=0&limit=10');

  // State to store the list of abilities
  const [abilityList, setAbilityList] = useState([]);

  // State to track current pagination offset
  const [currentOffset, setCurrentOffset] = useState(0);

  // State to track if we've reached the last page of data
  const [isLastPage, setIsLastPage] = useState(false);

  // Function to fetch Pokemon abilities from the API
  const fetchPokemonAbilities = async () => {
    try {
      // Get data using the API function
      const data = await getAbilityList(apiUrl);
      // Extract new abilities from response
      const newAbilities = data[0];
      // Extract URL for next page
      const nextApiUrl = data[1];

      // Add new abilities to existing list using spread operator
      setAbilityList((prev) => [...prev, ...newAbilities]);
      // Update the offset by adding length of new abilities
      setCurrentOffset(prev => prev + newAbilities.length);

      // If there's a next URL, update apiUrl for next fetch
      if (nextApiUrl !== null) {
        setApiUrl(nextApiUrl);
      } else {
        // If no next URL, we've reached the last page
        setApiUrl(null);
        setIsLastPage(true);
      }
    } catch (error) {
      console.error("Error fetching abilities:", error);
    }
  };

  // Function to handle "Show Less" functionality
  const deletePokemonAbilities = () => {
    try {
      // Calculate remaining items after removing 10
      const remainingItems = abilityList.length - 10;

      // If removing 10 would leave less than 20 items but more than 0
      if (remainingItems > 0 && remainingItems < 20) {
        // Remove items to keep exactly 10
        const itemsToRemove = abilityList.length - 10;
        setAbilityList(prev => prev.slice(0, -itemsToRemove));
        setCurrentOffset(10);
        // Reset to initial URL
        setApiUrl('https://pokeapi.co/api/v2/ability/?offset=0&limit=10');
      }
      // If we can safely remove 10 items (20+ remaining)
      else if (remainingItems >= 20) {
        // Remove last 10 items
        setAbilityList(prev => prev.slice(0, -10));
        // Decrease offset by 10
        setCurrentOffset(prev => prev - 10);
        // Update URL for new offset
        const newOffset = currentOffset - 10;
        const newUrl = `https://pokeapi.co/api/v2/ability/?offset=${newOffset}&limit=10`;
        setApiUrl(newUrl);
      }

      // Reset last page flag
      setIsLastPage(false);
    } catch (error) {
      console.error("Error handling show less:", error);
    }
  };

  // Effect to save ability list to localStorage when it changes
  useEffect(() => {
    if (abilityList.length > 0) {
      localStorage.setItem('abilityList', JSON.stringify(abilityList));
    }
  }, [abilityList]);

  // Effect to load initial data on component mount
  useEffect(() => {
    // Try to get stored abilities from localStorage
    const storedAbilities = localStorage.getItem('abilityList');

    if (storedAbilities) {
      // If found in localStorage, use stored data
      setAbilityList(JSON.parse(storedAbilities));
      setCurrentOffset(prev => prev + JSON.parse(storedAbilities).length);
    } else {
      // If not in localStorage, fetch from API
      fetchPokemonAbilities();
    }
  }, []);

  return (
    // Set up router for the application
    <Router>
      <div className="App">
        <Routes>
          {/* Home route */}
          <Route
            index
            element={
              <AbilityList
                abilityList={abilityList}
                fetchPokemonAbilities={fetchPokemonAbilities}
                deletePokemonAbilities={deletePokemonAbilities}
                apiUrl={apiUrl}
                currentOffset={currentOffset}
                isLastPage={isLastPage}
              />
            }
          />
          {/* Ability list route (same as home) */}
          <Route
            path="ability"
            element={
              <AbilityList
                abilityList={abilityList}
                fetchPokemonAbilities={fetchPokemonAbilities}
                deletePokemonAbilities={deletePokemonAbilities}
                apiUrl={apiUrl}
                currentOffset={currentOffset}
                isLastPage={isLastPage}
              />
            }
          />
          {/* Individual ability detail route */}
          <Route
            path="ability/:id"
            element={<AbilityDetail abilityList={abilityList} />}
          />
          {/* 404 route for unmatched paths */}
          <Route
            path="*"
            element={
              <div>
                404 - Page not found. Please return to the <Link to="/">homepage</Link>.
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;