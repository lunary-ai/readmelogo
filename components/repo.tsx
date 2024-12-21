
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
import { nFormatter } from "../utils/formatter";
import classes from "../styles/repo.module.css";

import type { Filters, GitHubRepository } from "../types";

export function RepoCard({
  repository,
  entry,
  setFilters,
}: {
  repository: GitHubRepository;
  entry: any;
  setFilters: (filters: any) => void;
}) {
  const topics = repository.topics?.map((badge) => (
    <Badge
      variant="light"
      key={badge}
      style={{
        cursor: "pointer",
      }}
      onClick={() =>
        setFilters((filters: Filters) => ({
          ...filters,
          tags: filters.tags.includes(badge)
            ? filters.tags.filter((v) => v !== badge)
            : [...filters.tags, badge],
        }))
      }
    >
      {badge}
    </Badge>
  ));

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      {/* @ts-ignore */}
      <Card.Section className={classes.section} align="center">
        <Group>
        {entry.placement === "both" ? (
          <>
            <Badge variant="light">
              website
            </Badge>

            <Badge variant="light">
              readme
            </Badge>
          </>
        ) : (
          <Badge variant="light">
            {entry.placement === "repo" ? "readme" : "website"}
          </Badge>
        )}
        </Group>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Image
          fit="contain"
          src={repository.owner.avatar_url}
          alt={repository.name}
          height={180}
        />
        <Group mt="sm">
          <Anchor href={repository.html_url} target="_blank">
            <Text fz="lg" fw={500} variant="gradient">
              {repository.full_name}
            </Text>
          </Anchor>
          <Badge size="sm" variant="light">
            ⭐️ {nFormatter(repository.stargazers_count)}
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
