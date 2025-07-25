import { Feather } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/contexts/auth-context";
import { SignOutButton } from "~/components/shared/sign-out-button";
import {
  profileStats,
  recentActivities,
  settingsOptions,
} from "~/data/profile";
import { getAvatarInitial } from "~/utils/search";

const ProfileScreen = () => {
  const { user } = useAuth();

  return (
    <ScrollView className="flex-1 ">
      {/* Header Section */}
      <View className="bg-background px-4 py-8 shadow-sm pt-safe">
        <View className="items-center">
          <View className="w-20 h-20 bg-primary rounded-full items-center justify-center mb-4">
            <Text className="text-primary-foreground font-bold text-2xl">
              {getAvatarInitial(user?.email)}
            </Text>
          </View>
          <Text className="text-2xl font-bold mb-1">
            {user?.user_metadata?.full_name || user?.user_metadata?.firstName || "User"}
          </Text>
          <Text className="text-base text-muted-foreground mb-2">
            {user?.email}
          </Text>
          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            <Text className="text-sm text-muted-foreground">Active now</Text>
          </View>
        </View>
      </View>
      {/* Stats Section */}
      <View className="px-4 py-6">
        <Text className="text-xl font-semibold mb-4">
          Your Activity
        </Text>
        <View className="flex-row justify-between">
          {profileStats.map((stat, index) => (
            <Card key={index} className="flex-1 mx-1">
              <CardContent className="p-4">
                <View
                  className={`w-10 h-10 ${stat.color} rounded-full items-center justify-center mb-3`}
                >
                  <Feather name={stat.icon as any} size={18} color="white" />
                </View>
                <Text className="text-2xl font-bold mb-1">
                  {stat.value}
                </Text>
                <Text className="text-sm text-muted-foreground">{stat.label}</Text>
              </CardContent>
            </Card>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View className="px-4 pb-6">
        <Text className="text-xl font-semibold mb-4">
          Recent Activity
        </Text>
        {recentActivities.slice(0, 2).map((activity) => (
          <Card key={activity.id} className="mb-3">
            <CardContent className="p-4">
              <View className="flex-row items-center">
                <View
                  className={`w-10 h-10 ${activity.iconColor} rounded-full items-center justify-center mr-3`}
                >
                  <Feather name={activity.icon as any} size={16} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium mb-1">
                    {activity.title}
                  </Text>
                  <Text className="text-sm text-muted-foreground">{activity.date}</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        ))}
      </View>

      {/* Settings Section */}
      <View className="px-4 pb-6">
        <Text className="text-xl font-semibold mb-4">
          Settings
        </Text>
        {settingsOptions.map((option, index) => (
          <Card key={index} className="mb-3">
            <CardContent className="p-4">
              <TouchableOpacity className="flex-row items-center">
                <View
                  className={`w-10 h-10 ${option.color} rounded-full items-center justify-center mr-4`}
                >
                  <Feather name={option.icon as any} size={18} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium mb-1">
                    {option.title}
                  </Text>
                  <Text className="text-sm text-muted-foreground">{option.subtitle}</Text>
                </View>
                <Feather name="chevron-right" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </CardContent>
          </Card>
        ))}
      </View>

      {/* Sign Out Section */}
      <View className="px-4 pb-8">
        <SignOutButton />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
