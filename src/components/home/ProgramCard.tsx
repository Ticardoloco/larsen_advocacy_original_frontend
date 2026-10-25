import { ProgramItem } from "@/services/program";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const ProgramCard = ({p}: {p: ProgramItem}) => {
  return (
    <Link
      key={p.slug}
      href={`/programs/${p.slug}`}
      className="surface-card group flex flex-col p-6 transition-transform hover:-translate-y-1"
    >
      <h3 className="text-lg text-primary">{p.name}</h3>
      <p className="mt-2 text-sm font-semibold text-accent">{p.taglines}</p>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {p.body[0]}
      </p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        Learn more{" "}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
};

export default ProgramCard;
