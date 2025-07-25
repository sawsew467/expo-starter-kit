import { Redirect, Stack } from "expo-router";
import { useAuth } from "~/contexts/auth-context";

export default function AuthRoutesLayout() {
  const { user, loading } = useAuth();

  // Show loading screen while checking auth state
  // if (loading) {
  //   return (
  //     <View className="flex-1 justify-center items-center bg-background">
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  // If user is authenticated, redirect to main app
  if (user) {
    return <Redirect href={"/(tabs)"} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
