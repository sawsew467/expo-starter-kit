import { useClerk } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();
  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to your desired page
      Linking.openURL(Linking.createURL("/"));
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
    <TouchableOpacity 
      onPress={handleSignOut}
      className="w-full h-12 bg-red-500 rounded-lg justify-center items-center flex-row"
    >
      <Feather name="log-out" size={18} color="white" />
      <Text className="text-white text-base font-semibold ml-2">
        Sign Out
      </Text>
    </TouchableOpacity>
  );
};
