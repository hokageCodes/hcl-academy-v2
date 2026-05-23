import { Check } from "lucide-react";

function TopicList({ items }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-4 rounded-xl border border-neutral-gray bg-white p-5 shadow-card"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-light">
            <Check className="size-4 text-primary" strokeWidth={2.5} aria-hidden />
          </span>
          <span className="font-body text-base leading-relaxed text-neutral-text">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ModuleList({ modules }) {
  return (
    <ol className="mt-6 space-y-4">
      {modules.map((module, index) => (
        <li
          key={module.title}
          className="rounded-xl border border-neutral-gray bg-white p-5 shadow-card"
        >
          <div className="flex gap-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-white">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="font-heading text-lg font-bold text-neutral-text">
                {module.title}
              </h4>
              {module.subtitle ? (
                <p className="mt-1 font-body text-sm leading-relaxed text-neutral-text/75">
                  {module.subtitle}
                </p>
              ) : null}
              {module.note ? (
                <p className="mt-2 font-body text-sm font-semibold text-primary">
                  {module.note}
                </p>
              ) : null}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function CurriculumOutline({ curriculum }) {
  return (
    <div className="space-y-14">
      <section>
        <h2 className="font-heading text-3xl font-bold text-neutral-text md:text-4xl">
          {curriculum.structure.title}
        </h2>
        {curriculum.structure.description ? (
          <p className="mt-3 max-w-2xl font-body text-neutral-text/75">
            {curriculum.structure.description}
          </p>
        ) : null}
        <TopicList items={curriculum.structure.topics} />
      </section>

      <section>
        <h2 className="font-heading text-3xl font-bold text-neutral-text md:text-4xl">
          {curriculum.program.title}
        </h2>
        {curriculum.program.description ? (
          <p className="mt-3 max-w-2xl font-body text-neutral-text/75">
            {curriculum.program.description}
          </p>
        ) : null}
        <ModuleList modules={curriculum.program.modules} />
      </section>
    </div>
  );
}
