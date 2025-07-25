import { useSignUp } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import * as React from "react";
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
import {
  emailVerificationSchema,
  signUpSchema,
  type EmailVerificationFormData,
  type SignUpFormData,
} from "~/lib/validations";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [signUpError, setSignUpError] = React.useState<string>("");
  const [verifyError, setVerifyError] = React.useState<string>("");

  // Sign-up form
  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
    },
  });

  // Verification form
  const verifyForm = useForm<EmailVerificationFormData>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: {
      code: "",
    },
  });

  // Handle submission of sign-up form
  const onSignUpPress = async (data: SignUpFormData) => {
    if (!isLoaded) return;

    setSignUpError("");

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress: data.emailAddress,
        password: data.password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      setSignUpError(
        err?.errors?.[0]?.message || "An error occurred during sign up. Please try again."
      );
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async (data: EmailVerificationFormData) => {
    if (!isLoaded) return;

    setVerifyError("");

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: data.code,
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
        setVerifyError("Verification failed. Please try again.");
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      setVerifyError(
        err?.errors?.[0]?.message || "Invalid verification code. Please try again."
      );
    }
  };

  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 px-4 pt-16 pb-6 justify-center">
            <Card className="mx-4">
              <CardHeader className="text-center">
                <CardTitle>Verify Your Email</CardTitle>
                <CardDescription>Enter the verification code sent to your email</CardDescription>
              </CardHeader>
              
              <CardContent>
                <FormGroup>
                  <Controller
                    control={verifyForm.control}
                    name="code"
                    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                      <FormFieldWrapper
                        label="Verification Code"
                        error={error?.message}
                        description="Enter the 6-digit code sent to your email"
                        required
                      >
                        <Input
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Enter 6-digit code"
                          keyboardType="number-pad"
                          maxLength={6}
                          className={error && 'border-destructive'}
                        />
                      </FormFieldWrapper>
                    )}
                  />

                  {verifyError && (
                    <Text className="text-sm text-destructive font-medium">
                      {verifyError}
                    </Text>
                  )}

                  <Button
                    variant="secondary"
                    onPress={verifyForm.handleSubmit(onVerifyPress)}
                    disabled={!isLoaded || verifyForm.formState.isSubmitting}
                    className="mt-6"
                  >
                    <Text>
                      {verifyForm.formState.isSubmitting ? "Verifying..." : "Verify Email"}
                    </Text>
                  </Button>
                </FormGroup>
              </CardContent>
            </Card>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-4 pt-16 pb-6 justify-center">
          <Card className="mx-4">
            <CardHeader className="text-center">
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Sign up to get started</CardDescription>
            </CardHeader>
            
            <CardContent>
              <FormGroup>
                <Controller
                  control={signUpForm.control}
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
                  control={signUpForm.control}
                  name="password"
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <FormFieldWrapper
                      label="Password"
                      error={error?.message}
                      description="Must be at least 8 characters with uppercase, lowercase, and number"
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

                {signUpError && (
                  <Text className="text-sm text-destructive font-medium">
                    {signUpError}
                  </Text>
                )}

                <Button
                  onPress={signUpForm.handleSubmit(onSignUpPress)}
                  disabled={!isLoaded || signUpForm.formState.isSubmitting}
                  className="mt-6"
                >
                  <Text>
                    {signUpForm.formState.isSubmitting ? "Creating Account..." : "Create Account"}
                  </Text>
                </Button>
              </FormGroup>
            </CardContent>
          </Card>

          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-muted-foreground">Already have an account? </Text>
            <Link href="/sign-in" className="ml-1">
              <Text className="text-primary font-medium">
                Sign in
              </Text>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
