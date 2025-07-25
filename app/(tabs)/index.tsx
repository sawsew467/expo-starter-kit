import { useUser } from "@clerk/clerk-expo";
import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import RecentActivity from "~/components/shared/recent-activity";

const HomeScreen = () => {
  const { user } = useUser();

  return (
    <View className="flex-1">
      {/* Header Section */}
      <View className="bg-background shadow-sm pt-safe py-6 px-4 z-10">
        <View className="flex-row items-center justify-between ">
          <View className="flex-1">
            <Text className="text-2xl font-bold mb-1 mt-2">
              Welcome back!
            </Text>
            <Text className="text-base text-muted-foreground">
              {user?.emailAddresses[0].emailAddress}
            </Text>
          </View>
          <View className="w-12 h-12 bg-primary rounded-full items-center justify-center">
            <Text className="text-primary-foreground font-semibold text-lg">
              {user?.emailAddresses[0].emailAddress?.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
      <ScrollView className="">
        <RecentActivity />
        <RecentActivity />
        <RecentActivity />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
