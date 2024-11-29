import type { GetStaticPaths, GetStaticProps } from "next";

import { Button, Container, Grid, Group, Stack } from "@mantine/core";
import { HeroSection } from "../components/hero";
import { RepoCard } from "../components/repo";

export default function IndexPage() {
  return (
    <Stack mt={50} justify="center">
      <HeroSection />

      <Container my="md">
        <Grid>
          <Grid.Col span={{ base: 12, xs: 4 }}>
            <RepoCard />
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 4 }}>
            <RepoCard />
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 4 }}>
            <RepoCard />
          </Grid.Col>
        </Grid>
      </Container>
    </Stack>
  );
}
