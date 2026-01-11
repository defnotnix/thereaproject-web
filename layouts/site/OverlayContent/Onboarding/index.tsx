"use client";

import {
  Stack,
  TextInput,
  Button,
  Text,
  Alert,
  Select,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/modules/auth/auth.store";
import { useDistricts, useDistrictsLoading, useDistrictsError, useGetDistricts } from "@/store/site.store";
import { OnboardingSchema, type OnboardingFormValues } from "./schemas";
import classes from "./onboarding.module.css";

interface OnboardingProps {
  onClose: () => void;
}

export default function Onboarding({ onClose }: OnboardingProps) {
  const { completeProfile, loading, error: storeError } = useAuthStore();
  const districts = useDistricts();
  const districtLoading = useDistrictsLoading();
  const districtError = useDistrictsError();
  const getDistricts = useGetDistricts();

  useEffect(() => {
    if (!districts) {
      getDistricts();
    }
  }, []);

  const districtOptions = (districts?.results || []).map((district) => ({
    value: String(district.id),
    label: district.name,
  }));

  const form = useForm<OnboardingFormValues>({
    initialValues: {
      phoneNumber: "",
      district: "",
      profession: "",
    },
    validate: (values) => {
      const result = OnboardingSchema.safeParse(values);
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const path = issue.path[0];
          if (path) {
            errors[String(path)] = issue.message;
          }
        });
        return errors;
      }
      return {};
    },
  });

  const handleSubmit = async (values: OnboardingFormValues) => {
    try {
      await completeProfile({
        phone_number: values.phoneNumber,
        district: values.district,
        profession: values.profession,
      });
      onClose();
    } catch (err) {
      // Error is handled by the useAuthStore hook
    }
  };

  return (
    <div className={classes.onboardingContainer}>
      <Stack gap="md">
        <div>
          <Text size="2rem" fw={600} mb="xs">
            Complete Your Profile
          </Text>
          <Text size="sm" opacity={0.6}>
            Please provide the following information to continue
          </Text>
        </div>

        {districtError && (
          <Alert color="orange" title="Warning">
            {districtError}
          </Alert>
        )}

        {storeError && (
          <Alert color="red" title="Error">
            {storeError}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="xs">
            <TextInput
              label="Phone Number"
              placeholder="+977 98xxxxxxxx"
              type="tel"
              {...form.getInputProps("phoneNumber")}
            />

            <Select
              label="District"
              placeholder={
                districtLoading ? "Loading districts..." : "Select your district"
              }
              data={districtOptions}
              searchable
              disabled={districtLoading || districtOptions.length === 0}
              rightSection={districtLoading ? <Loader size="xs" /> : undefined}
              {...form.getInputProps("district")}
            />

            <TextInput
              label="Profession"
              placeholder="e.g., Software Engineer, Teacher, etc."
              {...form.getInputProps("profession")}
            />

            <Button
              type="submit"
              loading={loading}
              fullWidth
              mt="md"
            >
              Complete Profile
            </Button>
          </Stack>
        </form>
      </Stack>
    </div>
  );
}
