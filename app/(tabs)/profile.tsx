import { SignOutButton } from "@/components/shared/sign-out-button";
import { useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { profileStats, settingsOptions, recentActivities } from "@/data/profile";
import { getAvatarInitial } from "@/utils/search";

const ProfileScreen = () => {
  const { user } = useUser();

  return (
    <ScrollView className="flex-1 ">
      {/* Header Section */}
      <View className="bg-white px-4 py-8 shadow-sm pt-safe">
        <View className="items-center">
          <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-4">
            <Text className="text-white font-bold text-2xl">
              {getAvatarInitial(user?.emailAddresses[0].emailAddress)}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            {user?.firstName || "User"} {user?.lastName || ""}
          </Text>
          <Text className="text-base text-gray-600 mb-2">
            {user?.emailAddresses[0].emailAddress}
          </Text>
          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            <Text className="text-sm text-gray-500">Active now</Text>
          </View>
        </View>
      </View>
      {/* Stats Section */}
      <View className="px-4 py-6">
        <Text className="text-xl font-semibold text-gray-900 mb-4">
          Your Activity
        </Text>
        <View className="flex-row justify-between">
          {profileStats.map((stat, index) => (
            <View
              key={index}
              className="bg-white rounded-2xl shadow-sm p-4 flex-1 mx-1"
            >
              <View
                className={`w-10 h-10 ${stat.color} rounded-full items-center justify-center mb-3`}
              >
                <Feather name={stat.icon as any} size={18} color="white" />
              </View>
              <Text className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </Text>
              <Text className="text-sm text-gray-600">{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View className="px-4 pb-6">
        <Text className="text-xl font-semibold text-gray-900 mb-4">
          Recent Activity
        </Text>
        {recentActivities.slice(0, 2).map((activity) => (
          <View key={activity.id} className="bg-white rounded-2xl shadow-sm p-4 mb-3">
            <View className="flex-row items-center">
              <View className={`w-10 h-10 ${activity.iconColor} rounded-full items-center justify-center mr-3`}>
                <Feather name={activity.icon as any} size={16} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900 mb-1">
                  {activity.title}
                </Text>
                <Text className="text-sm text-gray-500">{activity.date}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Settings Section */}
      <View className="px-4 pb-6">
        <Text className="text-xl font-semibold text-gray-900 mb-4">
          Settings
        </Text>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white rounded-2xl shadow-sm p-4 mb-3 flex-row items-center"
          >
            <View
              className={`w-10 h-10 ${option.color} rounded-full items-center justify-center mr-4`}
            >
              <Feather name={option.icon as any} size={18} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-900 mb-1">
                {option.title}
              </Text>
              <Text className="text-sm text-gray-500">{option.subtitle}</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#9CA3AF" />
          </TouchableOpacity>
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
