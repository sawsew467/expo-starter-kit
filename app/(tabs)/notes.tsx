import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { format } from "date-fns";
import { useNotesQuery } from "~/hooks";
import type { Note } from "~/types/database";

const { width } = Dimensions.get("window");

export default function NotesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const {
    data: notes = [],
    isLoading,
    refetch,
    isRefetching,
  } = useNotesQuery({
    search: search || undefined,
    limit: 50,
  });

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy 'at' HH:mm");
  };

  const renderNoteItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      onPress={() => router.push(`/notes/edit?id=${item.id}`)}
      activeOpacity={0.7}
    >
      <Card className="mb-3">
        <CardHeader className="pb-2">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="font-semibold text-lg mb-1" numberOfLines={2}>
                {item.title}
              </Text>
              <Text className="text-sm text-muted-foreground">
                {formatDate(item.updated_at)}
              </Text>
            </View>
          </View>
        </CardHeader>
        <CardContent className="pt-0">
          <Text className="text-muted-foreground" numberOfLines={3}>
            {item.content}
          </Text>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="bg-background px-4 pt-safe pb-6 shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-2xl font-bold">My Notes</Text>
            <Text className="text-muted-foreground mt-1">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </Text>
          </View>
          <Button
            onPress={() => router.push("/notes/create")}
            size="sm"
            className="px-4 flex flex-row items-center"
          >
            <Feather name="plus" size={16} color="white" />
            <Text className="ml-2 text-white">New</Text>
          </Button>
        </View>

        {/* Search */}
        <View className="relative">
          <Input
            placeholder="Search notes..."
            value={search}
            onChangeText={handleSearch}
            className="pr-10"
          />
          <View className="absolute right-3 top-3">
            <Feather name="search" size={20} color="#6b7280" />
          </View>
        </View>
      </View>

      {/* Notes List */}
      <View className="flex-1 px-4">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#6b7280" />
            <Text className="text-muted-foreground mt-4">Loading notes...</Text>
          </View>
        ) : (
          <FlatList
            data={notes}
            renderItem={renderNoteItem}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center py-12">
                <Feather name="file-text" size={48} color="#d1d5db" />
                <Text className="text-muted-foreground text-center mt-4">
                  {search
                    ? "No notes found matching your search"
                    : "No notes yet. Create your first note!"}
                </Text>
                {!search && (
                  <Button
                    onPress={() => router.push("/notes/create")}
                    variant="outline"
                    className="mt-4"
                  >
                    <Text>Create Note</Text>
                  </Button>
                )}
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
