import { Feather } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/contexts/auth-context";
import {
  quickSearchSuggestions,
  recentSearches,
  searchFilters,
  searchResults,
} from "~/data/search";
import { SearchFilter } from "~/types";
import {
  createScrollHandler,
  createScrollHeight,
  createScrollOpacity,
} from "~/utils/animations";
import {
  clearSearchQuery,
  filterSearchResults,
  getAvatarInitial,
} from "~/utils/search";

const SearchScreen = () => {
  const { user } = useAuth();
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
            overflow: "hidden",
          }}
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-2xl font-bold mb-1">
                Search
              </Text>
              <Text className="text-base text-muted-foreground">
                Find what you are looking for
              </Text>
            </View>
            <View className="w-12 h-12 bg-primary rounded-full items-center justify-center">
              <Text className="text-primary-foreground font-semibold text-lg">
                {getAvatarInitial(user?.email)}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Search Bar */}
        <View className="flex-row items-center mb-4">
          <View className="flex-1 relative">
            <Feather 
              name="search" 
              size={20} 
              color="#6B7280" 
              style={{ position: 'absolute', left: 12, top: 12, zIndex: 1 }}
            />
            <Input
              className="pl-10"
              placeholder="Search documents, people, projects..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => clearSearchQuery(setSearchQuery)}
              className="ml-2 p-2"
            >
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
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                size="sm"
                onPress={() => setActiveFilter(filter)}
                className="mr-3 rounded-full"
              >
                <Text>{filter}</Text>
              </Button>
            ))}
          </ScrollView>
        </View>

        {/* Quick Search Suggestions */}
        {searchQuery.length === 0 && (
          <View className="px-4 pb-6">
            <Text className="text-lg font-semibold mb-4">
              Quick Search
            </Text>
            <View className="flex-row flex-wrap">
              {quickSearchSuggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  className="mr-2 mb-2"
                >
                  <Text>{suggestion}</Text>
                </Button>
              ))}
            </View>
          </View>
        )}

        {/* Search Results */}
        {searchQuery.length > 0 && (
          <View className="px-4 pb-6">
            <Text className="text-lg font-semibold mb-4">
              Results ({filteredResults.length})
            </Text>
            {filteredResults.map((result) => (
              <Card key={result.id} className="mb-3">
                <CardContent className="p-4">
                  <TouchableOpacity>
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
                        <Feather
                          name={result.icon as any}
                          size={16}
                          color="#3B82F6"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-medium mb-1">
                          {result.title}
                        </Text>
                        <View className="flex-row items-center">
                          <Text className="text-sm text-muted-foreground mr-2">
                            {result.type}
                          </Text>
                          <Text className="text-sm text-muted-foreground">
                            • {result.date}
                          </Text>
                        </View>
                      </View>
                      <Feather name="chevron-right" size={16} color="#9CA3AF" />
                    </View>
                  </TouchableOpacity>
                </CardContent>
              </Card>
            ))}
          </View>
        )}

        {/* Recent Searches */}
        {searchQuery.length === 0 && (
          <View className="px-4 pb-6">
            <Text className="text-lg font-semibold mb-4">
              Recent Searches
            </Text>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center py-3"
              >
                <View className="w-8 h-8 bg-muted rounded-full items-center justify-center mr-3">
                  <Feather name="clock" size={14} color="#6B7280" />
                </View>
                <Text className="flex-1 text-base">{search}</Text>
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
