import { useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import React, { useState, useRef } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SearchFilter } from "@/types";
import { 
  searchFilters, 
  searchResults, 
  quickSearchSuggestions, 
  recentSearches 
} from "@/data/search";
import { 
  createScrollOpacity, 
  createScrollHeight, 
  createScrollHandler 
} from "@/utils/animations";
import { 
  filterSearchResults, 
  getAvatarInitial, 
  clearSearchQuery 
} from "@/utils/search";

const SearchScreen = () => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<SearchFilter>("All");
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = createScrollOpacity(scrollY);
  const headerTitleHeight = createScrollHeight(scrollY);
  
  // Filter search results based on active filter
  const filteredResults = filterSearchResults(searchResults, activeFilter);

  return (
    <View className="flex-1">
      {/* Header Section */}
      <View className="bg-white px-4 pt-safe shadow-sm z-10">
        <Animated.View 
          style={{ 
            height: headerTitleHeight,
            opacity: headerOpacity,
            overflow: 'hidden'
          }}
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900 mb-1">
                Search
              </Text>
              <Text className="text-base text-gray-600">
                Find what you are looking for
              </Text>
            </View>
            <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center">
              <Text className="text-white font-semibold text-lg">
                {getAvatarInitial(user?.emailAddresses[0].emailAddress)}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3 mb-4">
          <Feather name="search" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-3 text-base text-gray-900"
            placeholder="Search documents, people, projects..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => clearSearchQuery(setSearchQuery)}>
              <Feather name="x" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Animated.ScrollView 
        className="flex-1"
        onScroll={createScrollHandler(scrollY)}
        scrollEventThrottle={16}
      >
        {/* Filter Section */}
        <View className="px-4 py-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {searchFilters.map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`mr-3 px-4 py-2 rounded-full ${
                  activeFilter === filter
                    ? "bg-blue-500"
                    : "bg-white border border-gray-200"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    activeFilter === filter ? "text-white" : "text-gray-700"
                  }`}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Search Suggestions */}
        {searchQuery.length === 0 && (
          <View className="px-4 pb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Quick Search
            </Text>
            <View className="flex-row flex-wrap">
              {quickSearchSuggestions.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion}
                  className="bg-white px-4 py-2 rounded-lg mr-2 mb-2 border border-gray-200"
                >
                  <Text className="text-sm text-gray-700">{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Search Results */}
        {searchQuery.length > 0 && (
          <View className="px-4 pb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Results ({filteredResults.length})
            </Text>
            {filteredResults.map((result) => (
              <TouchableOpacity
                key={result.id}
                className="bg-white rounded-2xl shadow-sm p-4 mb-3"
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                    <Feather
                      name={result.icon as any}
                      size={16}
                      color="#3B82F6"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium text-gray-900 mb-1">
                      {result.title}
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="text-sm text-gray-500 mr-2">
                        {result.type}
                      </Text>
                      <Text className="text-sm text-gray-400">
                        • {result.date}
                      </Text>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={16} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Recent Searches */}
        {searchQuery.length === 0 && (
          <View className="px-4 pb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Recent Searches
            </Text>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center py-3"
              >
                <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3">
                  <Feather name="clock" size={14} color="#6B7280" />
                </View>
                <Text className="flex-1 text-base text-gray-700">{search}</Text>
                <TouchableOpacity>
                  <Feather name="x" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
};

export default SearchScreen;
