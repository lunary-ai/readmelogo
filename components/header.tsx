"use client";

import { Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "../styles/header.module.css";

const links = [
  { link: "/about", label: "About" },
  { link: "https://github.com/7HR4IZ3/github-ad-entries", label: "Github" },
];

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Text className={classes.title} onClick={toggle}>
          REPO SPONSOR
        </Text>

        <Group>
          <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
            {items}
          </Group>
        </Group>
      </div>
    </header>
  );
}
