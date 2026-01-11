"use client";

import { Container, Title, Text, Stack, Divider, Box } from "@mantine/core";

export function ModuleTermsOfService() {
  return (
    <Container size="sm" py={100}>
      <Stack gap="lg">
        <div>
          <Title order={1}>Terms of Service</Title>
          <Text c="dimmed" size="sm" mt="xs">
            Last Updated: January 5, 2026
          </Text>
        </div>

        <Text>
          Welcome to rastraekikaranabhiyan.com ("Platform", "we", "our", or
          "us"). These Terms of Service ("Terms") govern your access to and use
          of the website, applications, and services provided through this
          platform.
          <br />
          <br />
          By accessing or using the platform, you agree to be bound by these
          Terms. If you do not agree, you must discontinue use of the platform.
        </Text>

        <Divider />

        <div>
          <Title order={2}>1. Purpose of the Platform</Title>
          <Text>
            rastraekikaranabhiyan.com is a serious, purpose-driven platform
            intended for structured communication, participation, and
            engagement.
          </Text>
          <Text mt="md">The platform is built on the principles of:</Text>
          <Stack gap="xs" ml="md" mt="sm">
            <Text>• Open dialogue</Text>
            <Text>• Accountability</Text>
            <Text>• Ethical participation</Text>
          </Stack>
          <Text mt="md">
            Users are expected to engage responsibly and in good faith.
          </Text>
        </div>

        <Divider />

        <div>
          <Title order={2}>2. Eligibility & User Accounts</Title>
          <Stack gap="sm">
            <Text>
              Users must provide accurate, complete, and truthful information
              during registration and use.
            </Text>
            <Text>
              You are responsible for maintaining the confidentiality of your
              account credentials.
            </Text>
            <Text>
              All actions performed through your account are presumed to be
              authorized by you.
            </Text>
            <Text>
              We reserve the right to suspend or terminate accounts that provide
              false, misleading, or incomplete information.
            </Text>
          </Stack>
        </div>

        <Divider />

        <div>
          <Title order={2}>3. Freedom of Expression</Title>

          <Box mt="md">
            <Title order={3}>3.1 Commitment to Free Speech</Title>
            <Stack gap="sm">
              <Text>
                The platform explicitly supports and protects full freedom of
                expression.
              </Text>
              <Text>
                Users may freely express opinions, ideas, beliefs, criticism,
                and dissenting viewpoints without interference so long as such
                expression does not violate ethical standards, applicable laws,
                or the fundamental integrity of the platform.
              </Text>
              <Text>
                Disagreement, controversy, or unpopularity alone are not grounds
                for moderation.
              </Text>
            </Stack>
          </Box>

          <Box mt="md">
            <Title order={3}>3.2 Ethical Boundaries</Title>
            <Text>
              Freedom of expression does not extend to content or conduct that:
            </Text>
            <Stack gap="xs" ml="md" mt="sm">
              <Text>• Violates applicable laws or regulations</Text>
              <Text>
                • Promotes or incites violence, hatred, or physical harm
              </Text>
              <Text>• Constitutes harassment, threats, or intimidation</Text>
              <Text>
                • Deliberately spreads false or misleading information intended
                to cause harm
              </Text>
              <Text>• Involves impersonation or fraudulent representation</Text>
              <Text>
                • Attempts to undermine platform security, trust, or operational
                stability
              </Text>
            </Stack>
            <Text mt="md">
              Ethics and legality are the boundary — not ideology.
            </Text>
          </Box>
        </div>

        <Divider />

        <div>
          <Title order={2}>4. Accountability & Moderation</Title>
          <Stack gap="sm">
            <Text>
              All communications and interactions on the platform are stored and
              traceable to user accounts.
            </Text>
            <Text>
              Moderation actions are taken only when ethical boundaries, legal
              obligations, or platform rules are violated.
            </Text>
            <Text>
              Content is not moderated or removed solely for being
              controversial, critical, or dissenting.
            </Text>
            <Text>
              Accountability exists to preserve responsible discourse, not to
              suppress it.
            </Text>
          </Stack>
        </div>

        <Divider />

        <div>
          <Title order={2}>5. User Conduct</Title>
          <Text>By using the platform, you agree not to:</Text>
          <Stack gap="xs" ml="md" mt="sm">
            <Text>• Engage in unlawful or unethical activity</Text>
            <Text>
              • Attempt to gain unauthorized access to systems or data
            </Text>
            <Text>• Interfere with platform functionality or security</Text>
            <Text>
              • Use the platform for coordinated misuse, abuse, or manipulation
            </Text>
          </Stack>
          <Text mt="md">
            Users remain fully responsible for the content they create, share,
            or transmit.
          </Text>
        </div>

        <Divider />

        <div>
          <Title order={2}>6. Communications & Data Use</Title>
          <Stack gap="sm">
            <Text>
              All chats and communications are stored as part of platform
              operations and accountability.
            </Text>
            <Text>
              Communications are used only for platform functionality, security,
              and misuse prevention.
            </Text>
            <Text>
              No user data or communications are shared with third-party
              services.
            </Text>
          </Stack>
        </div>

        <Divider />

        <div>
          <Title order={2}>7. Notifications</Title>
          <Text>Users may receive notifications related to:</Text>
          <Stack gap="xs" ml="md" mt="sm">
            <Text>• Platform activity</Text>
            <Text>• System updates</Text>
            <Text>• Communications they voluntarily subscribe to</Text>
          </Stack>
          <Text mt="md">
            Opt-out options may be available for non-essential notifications.
          </Text>
        </div>

        <Divider />

        <div>
          <Title order={2}>8. Platform Availability</Title>
          <Text>
            We strive to provide reliable access but do not guarantee:
          </Text>
          <Stack gap="xs" ml="md" mt="sm">
            <Text>• Uninterrupted availability</Text>
            <Text>• Error-free operation</Text>
            <Text>• Immediate resolution of technical issues</Text>
          </Stack>
          <Text mt="md">
            We reserve the right to modify, suspend, or discontinue any part of
            the platform at any time.
          </Text>
        </div>

        <Divider />

        <div>
          <Title order={2}>9. Intellectual Property</Title>
          <Stack gap="sm">
            <Text>
              All platform content, including text, design, structure, software,
              and logos, is the intellectual property of
              rastraekikaranabhiyan.com unless otherwise stated.
            </Text>
            <Text>
              Unauthorized copying, distribution, or exploitation is prohibited.
            </Text>
          </Stack>
        </div>

        <Divider />

        <div>
          <Title order={2}>10. Enforcement & Termination</Title>
          <Text>We reserve the right to:</Text>
          <Stack gap="xs" ml="md" mt="sm">
            <Text>• Restrict or remove specific content</Text>
            <Text>• Suspend or terminate user access</Text>
            <Text>• Take necessary action to protect platform integrity</Text>
          </Stack>
          <Text mt="md">
            Such actions may be taken without prior notice in cases of serious
            or repeated violations.
          </Text>
        </div>

        <Divider />

        <div>
          <Title order={2}>11. Limitation of Liability</Title>
          <Text>To the fullest extent permitted by law:</Text>
          <Stack gap="xs" ml="md" mt="sm">
            <Text>• The platform is provided "as is" and "as available"</Text>
            <Text>
              • We are not liable for indirect, incidental, or consequential
              damages resulting from platform use or inability to use the
              platform
            </Text>
            <Text>• Users access and use the platform at their own risk.</Text>
          </Stack>
        </div>

        <Divider />

        <div>
          <Title order={2}>12. Governing Law & Jurisdiction</Title>
          <Stack gap="sm">
            <Text>These Terms are governed by the laws of India.</Text>
            <Text>
              Any disputes arising from or relating to these Terms shall be
              subject to the exclusive jurisdiction of the competent courts in
              India.
            </Text>
          </Stack>
        </div>

        <Divider />

        <div>
          <Title order={2}>13. Changes to These Terms</Title>
          <Stack gap="sm">
            <Text>We may update these Terms from time to time.</Text>
            <Text>
              Changes take effect immediately upon posting. Continued use of the
              platform constitutes acceptance of the updated Terms.
            </Text>
          </Stack>
        </div>

        <Divider />

        <div>
          <Title order={2}>14. Contact Information</Title>
          <Text>
            For questions or concerns regarding these Terms of Service, contact:
          </Text>
          <Stack gap="xs" ml="md" mt="sm">
            <Text>Email: rea.movement@gmail.com</Text>
          </Stack>
        </div>
      </Stack>
    </Container>
  );
}
