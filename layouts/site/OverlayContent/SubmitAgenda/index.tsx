"use client";

import { useState, useEffect } from "react";
import {
  Stack,
  Button,
  Group,
  Text,
  Textarea,
  Select,
  Stepper,
  CheckIcon,
  Center,
  Anchor,
} from "@mantine/core";
import Link from "next/link";
import {
  ShieldWarning,
  TextB,
  Note,
  MapPinPlus,
  ArrowLeftIcon,
  ArrowRightIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useDistricts, useGetDistricts } from "@/store/site.store";
import { useAuthStore } from "@/modules/auth/auth.store";
import classes from "./submitagenda.module.css";

interface SubmitAgendaProps {
  onClose: () => void;
  onSignIn?: () => void;
}

interface AgendaFormData {
  title: string;
  description: string;
  district: string;
}

export default function SubmitAgenda({ onClose, onSignIn }: SubmitAgendaProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AgendaFormData>({
    title: "",
    description: "",
    district: "",
  });

  const districts = useDistricts();
  const getDistricts = useGetDistricts();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!districts) {
      getDistricts();
    }
  }, [districts, getDistricts]);

  if (!isAuthenticated) {
    return (
      <Center h="100%">
        <Stack gap="md" align="center" maw={400}>
          <Text fw={600} size="2rem">
            Sign in required
          </Text>
          <Text size="xs" c="dimmed" ta="center">
            This is a collaborative platform where people work together to build
            a better Nepal. We need to make sure the problems are from legible
            sources so you can be credited if the solution comes through you.
          </Text>
          <Button variant="light" onClick={onSignIn} w="100%">
            Sign In / Register
          </Button>
        </Stack>
      </Center>
    );
  }

  const districtOptions = (districts?.results || []).map((district: { id: number; name: string }) => ({
    value: String(district.id),
    label: district.name,
  }));

  const handleInputChange = (field: keyof AgendaFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return true; // Disclaimer step, no validation
      case 1:
        return !!formData.title.trim();
      case 2:
        return !!formData.description.trim();
      case 3:
        return !!formData.district;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep(activeStep + 1);
    } else {
      alert("Please fill in all required fields");
    }
  };

  const handlePreviousStep = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSubmit = async () => {
    // Validate all required fields before submission
    if (!formData.title.trim()) {
      alert("Please enter an agenda title");
      return;
    }
    if (!formData.description.trim()) {
      alert("Please enter a problem description");
      return;
    }
    if (!formData.district) {
      alert("Please select a district");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement submit agenda API call
      // After successful submission, close the modal
      // onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.submitAgendaContainer}>
      <Stack gap="md">
        <div></div>

        <Stepper size="xs" active={activeStep} onStepClick={(step) => {
          if (step !== 0) {
            setActiveStep(step);
          }
        }}>
          <Stepper.Step icon={<ShieldWarning size={16} />} disabled>
            <Stack gap="md" py="xl">
              <Text fw={600} c="dimmed" size="xs">
                Step 1
              </Text>
              <Text fw={600} mb="md" size="2rem">
                Understanding Agenda Submission
              </Text>
              <Text size="xs" mb="lg" c="orange">
                ⚠️ This step is currently being worked on and will be available soon.
              </Text>
              <Text size="xs" mb="lg" c="dimmed">
                You are about to request for an agenda. Agendas are problems
                around your locality that need to be solved at a national or
                local level. The moderator of your area will review your request
                and take it further, activating it as an agenda only if it meets
                the required standards.
              </Text>

              <div>
                <Text size="sm" fw={500} mb="xs">
                  Important Reminders:
                </Text>
                <ul style={{ margin: "0 0 0 20px", paddingLeft: 0 }}>
                  <li>
                    <Text size="sm">
                      Please ensure you do not spam this feature
                    </Text>
                  </li>
                  <li>
                    <Text size="sm">
                      Your name is attached to every agenda you submit
                    </Text>
                  </li>
                  <li>
                    <Text size="sm">
                      This is a serious matter and requires honest input
                    </Text>
                  </li>
                  <li>
                    <Text size="sm">
                      Only submit legitimate concerns or ideas for community
                      improvement
                    </Text>
                  </li>
                </ul>
              </div>
            </Stack>
          </Stepper.Step>

          <Stepper.Step icon={<TextB size={16} />}>
            <Stack gap="md" py="xl">
              <Text fw={600} c="dimmed" size="xs">
                Step 2
              </Text>
              <Text fw={600} mb="md" size="2rem">
                Agenda Title
              </Text>
              <Text size="xs" mb="lg" c="dimmed">
                Provide a clear and concise title for your agenda
              </Text>
              <Textarea
                placeholder="e.g., Poor road conditions in main street"
                value={formData.title}
                onChange={(e) =>
                  handleInputChange("title", e.currentTarget.value)
                }
                required
                minRows={4}
              />
            </Stack>
          </Stepper.Step>

          <Stepper.Step icon={<Note size={16} />}>
            <Stack gap="md" py="xl">
              <Text fw={600} c="dimmed" size="xs">
                Step 3
              </Text>
              <Text fw={600} mb="md" size="2rem">
                Problem Description
              </Text>
              <Text size="xs" mb="lg" c="dimmed">
                Provide a detailed description of the problem or concern
              </Text>
              <Textarea
                rows={16}
                placeholder="Describe the problem in detail. Explain what is happening, where it's happening, and how it affects your community..."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.currentTarget.value)
                }
                required
                minRows={6}
              />
            </Stack>
          </Stepper.Step>

          <Stepper.Step icon={<MapPinPlus size={16} />}>
            <Stack gap="md" py="xl">
              <Text fw={600} c="dimmed" size="xs">
                Step 4
              </Text>
              <Text fw={600} mb="md" size="2rem">
                Select Location
              </Text>
              <Text size="xs" mb="lg" c="dimmed">
                Select the district where this agenda is relevant
              </Text>
              <Select
                placeholder="Select the district for this agenda"
                data={districtOptions}
                value={formData.district}
                onChange={(value) => handleInputChange("district", value || "")}
                searchable
                required
              />
            </Stack>
          </Stepper.Step>

          <Stepper.Completed>
            <Stack gap="md" py="xl">
              <Text fw={600} c="dimmed" size="xs">
                Finishing
              </Text>
              <Text fw={600} mb="md" size="2rem">
                Review your submittions.
              </Text>

              <div>
                <Stack
                  gap="md"
                  p="md"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <Text size="xs" opacity={0.6} fw={500}>
                      Title
                    </Text>
                    <Text
                      size="sm"
                      style={{ whiteSpace: "pre-wrap", marginTop: "4px" }}
                    >
                      {formData.title}
                    </Text>
                  </div>
                  <div>
                    <Text size="xs" opacity={0.6} fw={500}>
                      Problem Description
                    </Text>
                    <Text
                      size="sm"
                      style={{ whiteSpace: "pre-wrap", marginTop: "4px" }}
                    >
                      {formData.description}
                    </Text>
                  </div>
                  <div>
                    <Text size="xs" opacity={0.6} fw={500}>
                      District
                    </Text>
                    <Text size="sm" style={{ marginTop: "4px" }}>
                      {
                        districtOptions.find(
                          (d: { value: string; label: string }) => d.value === formData.district
                        )?.label
                      }
                    </Text>
                  </div>
                </Stack>
              </div>
            </Stack>
          </Stepper.Completed>
        </Stepper>

        <Text size="xs" c="dimmed" ta="center" mt="lg">
          By submitting, you agree to our{" "}
          <Anchor component={Link} href="/privacy-policy" target="_blank" size="xs">
            Privacy Policy
          </Anchor>
          {" "}and{" "}
          <Anchor component={Link} href="/terms-of-service" target="_blank" size="xs">
            Terms of Service
          </Anchor>
        </Text>

        <Group justify="space-between" mt="xl" gap="xs">
          <Group>
            {activeStep > 0 && (
              <Button
                variant="default"
                onClick={handlePreviousStep}
                leftSection={<ArrowLeftIcon />}
              >
                Previous
              </Button>
            )}
          </Group>

          <Group gap="xs">
            {activeStep < 4 && (
              <Button
                onClick={handleNextStep}
                rightSection={<ArrowRightIcon />}
                disabled
              >
                Next
              </Button>
            )}
            {activeStep === 4 && (
              <Button
                loading={isLoading}
                onClick={handleSubmit}
                leftSection={<CheckIcon />}
              >
                Submit Agenda
              </Button>
            )}
            <Button variant="subtle" onClick={onClose} leftSection={<XIcon />}>
              Cancel
            </Button>
          </Group>
        </Group>
      </Stack>
    </div>
  );
}
