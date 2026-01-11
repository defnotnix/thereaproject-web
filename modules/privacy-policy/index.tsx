"use client";

import {
  Container,
  Title,
  Text,
  Stack,
  Divider,
  Group,
  Button,
} from "@mantine/core";
import { ArrowLeftIcon } from "@phosphor-icons/react";

export function ModulePrivacyPolicy() {
  return (
    <Container size="sm" py={100}>
      <Stack gap="lg">
        <div>
          <Title order={1}>Privacy Policy</Title>
          <Text c="dimmed" size="sm" mt="xs">
            Last Updated: January 5, 2026
          </Text>
        </div>

        <Text>
          Welcome to rastraekikaranabhiyan.com ("we", "our", or "us").
          <br />
          <br />
          We are committed to protecting the privacy, integrity, and security of
          our users' information. This Privacy Policy explains what information
          we collect, how it is used, how it is stored, and the choices
          available to you.
          <br />
          <br />
          By using this website and its services, you agree to the practices
          described in this policy.
        </Text>

        <Divider />

        <div>
          <Title order={2}>1. Information We Collect</Title>
          <Text>
            We collect only the information necessary for the functioning,
            security, and accountability of the platform.
          </Text>

          <Stack gap="md" mt="md" ml="md">
            <div>
              <Title order={3}>a) Personal Information</Title>
              <Text>
                When you register, interact, or communicate on the platform, we
                may collect:
              </Text>
              <Stack gap="xs" ml="md" mt="sm">
                <Text>• Name</Text>
                <Text>• Email address</Text>
                <Text>• Phone number</Text>
                <Text>• Location</Text>
                <Text>• Occupation</Text>
              </Stack>
              <Text mt="sm">
                This information is provided voluntarily by the user.
              </Text>
            </div>

            <div>
              <Title order={3}>b) User Communications</Title>
              <Text>
                All chats and communications conducted on the platform are
                stored and linked to the user account. This is done to ensure
                accountability, traceability, and the integrity of the platform,
                given its serious nature.
              </Text>
            </div>

            <div>
              <Title order={3}>c) Usage & Interaction Data</Title>
              <Text>
                We automatically collect certain technical and usage
                information, including:
              </Text>
              <Stack gap="xs" ml="md" mt="sm">
                <Text>• Page visits</Text>
                <Text>• Interactions within the platform</Text>
                <Text>• Time spent on pages</Text>
                <Text>• General activity logs</Text>
              </Stack>
              <Text mt="sm">
                This data is used to maintain platform stability, security, and
                performance.
              </Text>
            </div>
          </Stack>
        </div>

        <Divider />

        <div>
          <Title order={2}>2. How We Use Your Information</Title>
          <Text>
            We use collected information strictly within the platform ecosystem
            for the following purposes:
          </Text>
          <Stack gap="xs" ml="md" mt="sm">
            <Text>• Operating and maintaining the platform</Text>
            <Text>
              • Sending notifications that you voluntarily subscribe to
            </Text>
            <Text>• Ensuring website and platform security</Text>
            <Text>
              • Preventing misuse, abuse, fraud, or unauthorized activity
            </Text>
            <Text>
              • Maintaining accountability and traceability of user interactions
            </Text>
          </Stack>
          <Text mt="md">
            We do not use your data for advertising or commercial resale.
          </Text>
        </div>

        <Divider />

        <div>
          <Title order={2}>3. Data Storage & Retention</Title>
          <Text>
            All user data, including communications and interaction logs, is
            securely stored within our platform infrastructure. Data is retained
            only for as long as it is required for platform operations,
            security, and applicable legal or regulatory obligations.
          </Text>
        </div>

        <Divider />

        <div>
          <Title order={2}>4. Third-Party Services</Title>
          <Text>
            We do not share, sell, rent, or transmit user data to any
            third-party services.
          </Text>
          <Text mt="md">
            All user information is maintained strictly within the platform's
            own ecosystem and is accessed only by authorized systems or
            personnel for legitimate operational and security purposes.
          </Text>
        </div>

        <Divider />

        <div>
          <Title order={2}>5. Data Security</Title>
          <Text>
            We implement reasonable administrative, technical, and physical
            security measures to protect your information. However, no method of
            transmission over the internet or electronic storage is 100% secure,
            and we cannot guarantee absolute security.
          </Text>
        </div>

        <Divider />

        <div>
          <Title order={2}>6. User Responsibility</Title>
          <Text>Users are responsible for:</Text>
          <Stack gap="xs" ml="md" mt="sm">
            <Text>
              • Maintaining the confidentiality of their account credentials
            </Text>
            <Text>• Ensuring the accuracy of the information they provide</Text>
            <Text>
              • Any activity performed through a user account is presumed to be
              authorized by the account holder.
            </Text>
          </Stack>
        </div>

        <Divider />

        <div>
          <Title order={2}>7. Changes to This Privacy Policy</Title>
          <Text>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated "Last Updated" date.
            Continued use of the platform constitutes acceptance of the revised
            policy.
          </Text>
        </div>

        <Divider />

        <div>
          <Title order={2}>8. Contact Information</Title>
          <Text>
            If you have any questions or concerns regarding this Privacy Policy,
            you may contact us at:
          </Text>
          <Stack gap="xs" ml="md" mt="sm">
            <Text>Email: rea.movement@gmail.com</Text>
          </Stack>
        </div>
      </Stack>
    </Container>
  );
}
