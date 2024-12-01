import { IconLink } from "@tabler/icons-react";
import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Card,
  Group,
  Image,
  RingProgress,
  Text,
} from "@mantine/core";
import classes from "../styles/repo.module.css";

import type { GitHubRepository } from "../types";

export function RepoCard({
  repository,
  entry,
}: {
  repository: GitHubRepository;
  entry: any;
}) {
  const topics = repository.topics?.map((badge) => (
    <Badge variant="light" key={badge} leftSection={""}>
      {badge}
    </Badge>
  ));

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section>
        <Image
          src={repository.owner.avatar_url}
          alt={repository.name}
          height={180}
        />
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Group justify="apart">
          <Anchor href={repository.html_url} target="_blank">
            <Text fz="lg" fw={500} variant="gradient">
              {repository.full_name}
            </Text>
          </Anchor>
          <Badge size="sm" variant="light">
            ⭐️ {repository.stargazers_count}
          </Badge>
        </Group>
        <Text fz="sm" mt="xs" c="dimmed">
          <Anchor href={repository.homepage} target="_blank">
            {repository.homepage}
          </Anchor>
        </Text>
        <Text fz="sm" mt="xs">
          {repository.description}
        </Text>
      </Card.Section>

      {topics?.length ? (
        <Card.Section className={classes.section}>
          <Text mt="md" className={classes.label} c="dimmed">
            Topics
          </Text>
          <Group gap={7} mt={5}>
            {topics}
          </Group>
        </Card.Section>
      ) : null}

      {/* <Group justify="space-between" mt="xl">
        <Text fz="sm" fw={700} className={classes.title}>
          Running challenge
        </Text>
        <Group gap={5}>
          <Text fz="xs" c="dimmed">
            80% completed
          </Text>
          <RingProgress
            size={18}
            thickness={2}
            sections={[{ value: 80, color: "blue" }]}
          />
        </Group>
      </Group> */}

      <Card.Section className={classes.footer}>
        {/* @ts-ignore */}
        <Text fw={500} size="sm" align="center">
          Become a sponsor for as low as{" "}
          <Text c="red" fw={500}>
            $ {entry.ad_price}
          </Text>{" "}
          per month and have your brand logo displayed on{" "}
          {entry.placement === "both"
            ? "both the README and the website"
            : entry.placement === "website"
            ? "the website"
            : "the README"}{" "}
          of the repository.
        </Text>
      </Card.Section>

      <Group mt="xs">
        <Anchor href={entry.sponsor_url} target="_blank" style={{ flex: 1 }}>
          <Button
            w="100%"
            variant="outline"
            color="red"
            radius="md"
            title="Sponsor"
          >
            Sponsor
          </Button>
        </Anchor>
        <Anchor href={repository.html_url} target="_blank">
          <ActionIcon
            variant="default"
            radius="md"
            size={36}
            title="View Repository"
          >
            <IconLink className={classes.like} stroke={1.5} />
          </ActionIcon>
        </Anchor>
      </Group>
    </Card>
  );
}
