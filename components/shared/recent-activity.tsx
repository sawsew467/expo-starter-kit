import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { recentActivities } from "~/data/profile";

function RecentActivity() {
  const router = useRouter();

  return (
    <View className="px-4 py-4">
      <Text className="text-xl font-semibold mb-4">Recent Activity</Text>
      {recentActivities.slice(0, 2).map((activity) => (
        <Card key={activity.id} className="mb-4">
          <CardContent className="p-6">
            <TouchableOpacity
              onPress={() => {
                router.push("/tasks");
              }}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-10 h-10 ${activity.iconColor} rounded-full items-center justify-center mr-3`}
                >
                  <Feather
                    name={activity.icon as any}
                    size={16}
                    color="white"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium">
                    {activity.title}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {activity.date}
                  </Text>
                </View>
                <Feather name="chevron-right" size={16} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          </CardContent>
        </Card>
      ))}
    </View>
  );
}

export default RecentActivity;
