import { ImpactItem } from "@/services/impact";
import React from "react";
import { Counter } from "./Counter";

interface ImpactProps {
  impacts?: ImpactItem[];
  loading?: boolean;
}

const Impact: React.FC<ImpactProps> = ({ impacts = [], loading = false }) => {
  const reversedImpacts = [...impacts].reverse();

  return (
    <section className="bg-primary-deep py-20 text-primary-foreground">
      <div className="container-page">
        <p className="eyebrow">Our impact so far</p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            // Display initial zeros while fetching API data
            [1, 2, 3, 4].map((idx) => (
              <div key={idx} className="border-l-2 border-accent/40 pl-5">
                <Counter value={0} suffix="+" />
                <p className="mt-3 text-sm leading-relaxed text-primary-foreground/75">
                  Loading statistics...
                </p>
              </div>
            ))
          ) : (
            // Animate from 0 to target value when API data arrives
            reversedImpacts.map((item) => (
              <div key={item._id || item.label} className="border-l-2 border-accent/40 pl-5">
                <Counter
                  key={`${item._id || item.label}-${item.value}`}
                  value={item.value}
                  suffix={item.suffix}
                />
                <p className="mt-3 text-sm leading-relaxed text-primary-foreground/75">
                  {item.label}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Impact;