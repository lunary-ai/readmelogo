import { IconLink } from "@tabler/icons-react";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Image,
  RingProgress,
  Text,
} from "@mantine/core";
import classes from "../styles/repo.module.css";
import { useRepository } from "../utils/github";

const mockdata = {
  repo: "libgit2/pygit2",
  image:
    "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
  title: "Verudela Beach",
  country: "Croatia",
  description:
    "Completely renovated for the season 2020, Arena Verudela Bech Apartments are fully equipped and modernly furnished 4-star self-service apartments located on the Adriatic coastline by one of the most beautiful beaches in Pula.",
  badges: [
    { emoji: "☀️", label: "Sunny weather" },
    { emoji: "🦓", label: "Onsite zoo" },
    { emoji: "🌊", label: "Sea" },
    { emoji: "🌲", label: "Nature" },
    { emoji: "🤽", label: "Water sports" },
  ],
  stats: [
    { title: "1 Month", value: "25" },
    { title: "3 Months", value: "50" },
    { title: "5 Months", value: "100" },
  ],
};

export function RepoCard() {
  const { repo, image, title, description, stats, badges } = mockdata;

  const [name, owner] = repo.split("/");
  const { repository, loading } = useRepository(name, owner);

  console.log(repository);

  if (loading || !repository) return <div>Loading...</div>;

  const topics = repository.topics?.map((badge) => (
    <Badge variant="light" key={badge} leftSection={""}>
      {badge}
    </Badge>
  ));

  const items = stats.map((stat) => (
    <div key={stat.title}>
      <Text size="xs" color="dimmed">
        {stat.title}
      </Text>
      {/** @ts-ignore */}
      <Text fw={500} size="sm" align="center">
        {stat.value}
      </Text>
    </div>
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
          <Text fz="lg" fw={500} variant="gradient">
            {repository.full_name}
          </Text>
          <Badge size="sm" variant="light">
            ⭐️ {repository.stargazers_count}
          </Badge>
        </Group>
        <Text fz="sm" mt="xs">
          {repository.description}
        </Text>
      </Card.Section>

      {topics?.length && (
        <Card.Section className={classes.section}>
          <Text mt="md" className={classes.label} c="dimmed">
            Topics
          </Text>
          <Group gap={7} mt={5}>
            {topics}
          </Group>
        </Card.Section>
      )}

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

      <Text mt="sm" mb="md" c="dimmed" fz="xs"></Text>
      <Card.Section className={classes.footer}>{items}</Card.Section>

      <Group mt="xs">
        <Button
          variant="outline"
          color="red"
          radius="md"
          style={{ flex: 1 }}
          title="Sponsor"
        >
          Sponsor
        </Button>
        <ActionIcon
          variant="default"
          radius="md"
          size={36}
          title="View Repository"
        >
          <IconLink className={classes.like} stroke={1.5} />
        </ActionIcon>
      </Group>
    </Card>
  );
}
