import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { recentActivities } from "@/data/profile";

function RecentActivity() {
  const router = useRouter();

  return (
    <View className="px-4 py-4">
      <Text className="text-xl font-semibold text-gray-900 mb-4">
        Recent Activity
      </Text>
      {recentActivities.slice(0, 2).map((activity) => (
        <TouchableOpacity
          key={activity.id}
          className="bg-white rounded-2xl shadow-sm p-6 mb-4"
          onPress={() => {
            if (activity.title.includes("Task")) {
              router.push("/tasks");
            }
          }}
        >
          <View className="flex-row items-center">
            <View className={`w-10 h-10 ${activity.iconColor} rounded-full items-center justify-center mr-3`}>
              <Feather name={activity.icon as any} size={16} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-900">
                {activity.title}
              </Text>
              <Text className="text-sm text-gray-500">{activity.date}</Text>
            </View>
            {activity.title.includes("Task") && (
              <Feather name="chevron-right" size={16} color="#9CA3AF" />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default RecentActivity;
