type Props = {
  label: string;
};

export default function MetaPill({ label }: Props) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
      {label}
    </span>
  );
}