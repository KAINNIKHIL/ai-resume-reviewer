"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function JobDescriptionCard({
  value,
  onChange,
}: Props) {
  return (
    <div className="rounded-3xl border bg-card shadow-sm p-6 h-full">

      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Job Description
        </h2>

        <p className="text-muted-foreground mt-2">
          Paste the complete job description from
          LinkedIn, Indeed, Naukri or any company.
        </p>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste Job Description..."
        className="
          w-full
          h-[500px]
          rounded-2xl
          border
          bg-background
          p-5
          text-sm
          resize-none
          outline-none
          focus:ring-2
          focus:ring-primary
        "
      />

      <p className="mt-3 text-xs text-muted-foreground">
        The AI will compare this job description with your selected resume.
      </p>
    </div>
  );
}