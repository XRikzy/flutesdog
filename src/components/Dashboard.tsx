import { useState } from "react";
import { Accordion } from "@mantine/core";
import { IconClipboard, IconAward, IconScreenshot } from "@tabler/icons-react";
import classes from "./css/NavbarSimple.module.css";
import { ClipsTable } from "./Dashboard/ClipsTable";

const data = [
  { id: "clips", link: "", label: "Clips", icon: IconClipboard },
  { id: "awards", link: "", label: "Awards", icon: IconAward },
  { id: "screenshots", link: "", label: "Screenshots", icon: IconScreenshot },
];

export function Dashboard() {
  const [active, setActive] = useState("Billing");

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <>
      <div className={classes.main}>
        <nav className={classes.navbar}>
          <div className={classes.navbarMain}>
            <Accordion variant="filled" radius="lg">
              <Accordion.Item value="content">
                <Accordion.Control>Contenido</Accordion.Control>
                <Accordion.Panel>{links}</Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </div>
        </nav>
        <ClipsTable />
      </div>
    </>
  );
}
