import { Container } from "@mantine/core";
import type { ReactNode } from "react";
import classes from "./LibraryPage.module.css";

type LibraryPageProps = {
  title: string;
  summary?: ReactNode;
  backLink?: ReactNode;
  actions?: ReactNode;
  filters?: ReactNode;
  feedback?: ReactNode;
  children: ReactNode;
};

export function LibraryPage({ title, summary, backLink, actions, filters, feedback, children }: LibraryPageProps) {
  return (
    <Container size="xl" className={classes.page}>
      <header className={classes.header}>
        <div className={classes.heading}>
          <div className={classes.intro}>
            {backLink}
            <h1 className={classes.title}>{title}</h1>
            {summary && <p className={classes.summary}>{summary}</p>}
          </div>
          {actions && <div className={classes.actions}>{actions}</div>}
        </div>
        {filters && <div className={classes.filters}>{filters}</div>}
        {feedback}
      </header>
      {children}
    </Container>
  );
}

export function LibraryEmpty({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className={classes.empty}>
      <div className={classes.emptyIcon} aria-hidden="true">{icon}</div>
      <p className={classes.emptyTitle}>{title}</p>
      <p className={classes.summary}>{description}</p>
    </div>
  );
}
