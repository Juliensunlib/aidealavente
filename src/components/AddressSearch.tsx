import React, { useState } from 'react';
import { MapPin, Search, Loader } from 'lucide-react';
import { searchAddress } from '../services/geoportail';

interface AddressSearchProps {
  onAddressSelect: (address: string, latitude: number, longitude: number) => void;
  selectedAddress: string;
}

const AddressSearch: React.FC<AddressSearchProps> = ({ onAddressSelect, selectedAddress }) => {
  const [searchTerm, setSearchTerm] = useState(selectedAddress);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = async (term: string) => {
    if (term.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await searchAddress(term);
      setSuggestions(response.features || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Erreur de recherche:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleSuggestionClick = (suggestion: any) => {
    const [longitude, latitude] = suggestion.geometry.coordinates;
    const address = suggestion.properties.label;
    
    setSearchTerm(address);
    setShowSuggestions(false);
    onAddressSelect(address, latitude, longitude);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Adresse du projet
      </label>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          placeholder="Saisissez l'adresse..."
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <Loader className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <MapPin className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-800">{suggestion.properties.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressSearch;