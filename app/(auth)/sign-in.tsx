import { useSignIn } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View,
} from "react-native";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { FormFieldWrapper, FormGroup } from "~/components/ui/form-control";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { signInSchema, type SignInFormData } from "~/lib/validations";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [submitError, setSubmitError] = React.useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
    },
  });

  // Handle the submission of the sign-in form
  const onSignInPress = async (data: SignInFormData) => {
    if (!isLoaded) return;

    setSubmitError("");

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: data.emailAddress,
        password: data.password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
        setSubmitError("Authentication failed. Please try again.");
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      setSubmitError(
        err?.errors?.[0]?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-4 pt-16 pb-6 justify-center">
          <Card className="mx-4">
            <CardHeader className="text-center">
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            
            <CardContent>
              <FormGroup>
                <Controller
                  control={control}
                  name="emailAddress"
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <FormFieldWrapper
                      label="Email"
                      error={error?.message}
                      required
                    >
                      <Input
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className={error && 'border-destructive'}
                      />
                    </FormFieldWrapper>
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <FormFieldWrapper
                      label="Password"
                      error={error?.message}
                      required
                    >
                      <Input
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Enter your password"
                        secureTextEntry={true}
                        className={error && 'border-destructive'}
                      />
                    </FormFieldWrapper>
                  )}
                />

                {submitError && (
                  <Text className="text-sm text-destructive font-medium">
                    {submitError}
                  </Text>
                )}

                <Button
                  onPress={handleSubmit(onSignInPress)}
                  disabled={!isLoaded || isSubmitting}
                  className="mt-6"
                >
                  <Text>{isSubmitting ? "Signing In..." : "Sign In"}</Text>
                </Button>
              </FormGroup>
            </CardContent>
          </Card>

          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-muted-foreground">Don't have an account? </Text>
            <Link href="/sign-up" className="ml-1">
              <Text className="text-primary font-medium">
                Sign up
              </Text>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
