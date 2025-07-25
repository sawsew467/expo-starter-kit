import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
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
import { NotesService } from "~/lib/supabase-crud";
import type { Note } from "~/types/database";

const { width } = Dimensions.get("window");

export default function NotesScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const loadNotes = async (searchTerm = "") => {
    setLoading(true);
    const { data, error } = await NotesService.getNotes({
      search: searchTerm || undefined,
      limit: 50,
    });

    if (error) {
      Alert.alert("Error", error);
    } else {
      setNotes(data);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotes(search);
    setRefreshing(false);
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.length === 0 || text.length >= 2) {
      loadNotes(text);
    }
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  useFocusEffect(
    useCallback(() => {
      loadNotes(search);
    }, [])
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
        <FlatList
          data={notes}
          renderItem={renderNoteItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
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
      </View>
    </View>
  );
}
