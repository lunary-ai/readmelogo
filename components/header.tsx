
"use client";
import { IconSearch } from "@tabler/icons-react";
import { Burger, Group } from "@mantine/core";
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
        <Group>
          {/* <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" /> */}
          {/* <MantineLogo size={28} /> */}
          REPO SPONSOR
        </Group>

        <Group>
          <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
            {items}
          </Group>
        </Group>
      </div>
    </header>
  );
}
