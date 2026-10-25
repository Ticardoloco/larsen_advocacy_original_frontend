import { ProgramItem } from "@/services/program";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const OtherProgramCard = ({p}: {p: ProgramItem}) => {
  return (
    <Link
      href={`/programs/${p.slug}`}
      className="surface-card group p-6 transition-transform hover:-translate-y-1"
    >
      <h3 className="text-lg text-primary">{p.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{p.taglines}</p>
      <ArrowRight className="mt-4 h-4 w-4 text-accent transition-transform group-hover:translate-x-1" />
    </Link>
  );
};

export default OtherProgramCard;
