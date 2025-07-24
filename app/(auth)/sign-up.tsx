import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 px-4 pt-16 pb-6">
            <View className="mb-12">
              <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Verify Your Email
              </Text>
              <Text className="text-base text-gray-500 text-center">
                Enter the verification code sent to your email
              </Text>
            </View>

            <View className="mb-8">
              <View className="mb-5">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Verification Code
                </Text>
                <TextInput
                  className="h-12 border border-gray-300 rounded-lg px-4 text-base bg-white text-gray-900"
                  value={code}
                  placeholder="Enter 6-digit code"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  maxLength={6}
                  onChangeText={(code) => setCode(code)}
                />
              </View>

              <TouchableOpacity
                className="h-12 bg-purple-500 rounded-lg justify-center items-center mt-6"
                onPress={onVerifyPress}
                disabled={!isLoaded}
              >
                <Text className="text-white text-base font-semibold">
                  Verify Email
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-4 pt-16 pb-6">
          <View className="mb-12">
            <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">
              Create Account
            </Text>
            <Text className="text-base text-gray-500 text-center">
              Sign up to get started
            </Text>
          </View>

          <View className="mb-8">
            <View className="mb-5">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Email
              </Text>
              <TextInput
                className="h-12 border border-gray-300 rounded-lg px-4 text-base bg-white text-gray-900"
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                onChangeText={(email) => setEmailAddress(email)}
              />
            </View>

            <View className="mb-5">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Password
              </Text>
              <TextInput
                className="h-12 border border-gray-300 rounded-lg px-4 text-base bg-white text-gray-900"
                value={password}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
              />
            </View>

            <TouchableOpacity
              className="h-12 bg-green-500 rounded-lg justify-center items-center mt-6"
              onPress={onSignUpPress}
              disabled={!isLoaded}
            >
              <Text className="text-white text-base font-semibold">
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center items-center">
            <Text className="text-sm text-gray-500">
              Already have an account?
            </Text>
            <Link href="/sign-in" className="ml-1">
              <Text className="text-sm text-blue-500 font-semibold">
                Sign in
              </Text>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
