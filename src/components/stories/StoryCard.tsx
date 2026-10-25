import { StoryItems } from "@/services/stories";
import React from "react";

const StoryCard = ({item}: {item: StoryItems}) => {
  return (
    <li className="relative pb-12 last:pb-0">
      <span className="absolute -left-10.25 mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-accent bg-background" />
      <p className="eyebrow">{item.year}</p>
      <h2 className="mt-2 text-xl text-primary md:text-2xl">{item.title}</h2>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
        {item.body}
      </p>
    </li>
  );
};

export default StoryCard;
