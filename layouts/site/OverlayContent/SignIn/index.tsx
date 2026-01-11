"use client";

import { useState } from "react";
import { Stack, Button, Group, Text, Alert, Anchor } from "@mantine/core";
import { GoogleLogoIcon } from "@phosphor-icons/react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/modules/auth/auth.store";
import Link from "next/link";
import classes from "./signin.module.css";

interface SignInProps {
  onClose: () => void;
}

export default function SignIn({ onClose }: SignInProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { googleSignIn } = useAuthStore();

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setError(null);
      setIsLoading(true);
      try {
        await googleSignIn(codeResponse.access_token);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Google sign in failed");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setError("Failed to sign in with Google");
      setIsLoading(false);
    },
    flow: "implicit",
  });

  const handleGoogleLogin = () => {
    setIsLoading(true);
    googleLogin();
  };

  return (
    <div className={classes.signInContainer}>
      <Stack gap="md">
        <div>
          <Text ta="center" size="2rem" fw={600} mb="xs">
            Sign In
          </Text>
          <Text ta="center" size="xs" c="dimmed" fw={600} mb="xs">
            Sign in with your Google account.
          </Text>
        </div>

        {error && (
          <Alert color="red" title="Login Error">
            {error}
          </Alert>
        )}

        <Button
          variant="white"
          fullWidth
          onClick={handleGoogleLogin}
          loading={isLoading}
          leftSection={<GoogleLogoIcon size={16} weight="bold" />}
        >
          Continue with Google
        </Button>

        <Group justify="center">
          <Text size="xs" ta="center">
            Don't have an account yet?
            <br />
            Just continue with Google above, and we'll guide you from there.
          </Text>
        </Group>

        <Text size="xs" c="dimmed" ta="center" mt="xl">
          By continuing, you agree to our{" "}
          <Anchor
            component={Link}
            href="/privacy-policy"
            target="_blank"
            size="xs"
          >
            Privacy Policy
          </Anchor>{" "}
          and{" "}
          <Anchor
            component={Link}
            href="/terms-of-service"
            target="_blank"
            size="xs"
          >
            Terms of Service
          </Anchor>
        </Text>
      </Stack>
    </div>
  );
}
