export function Toast({ message }: { message: string }) {
  return <div className="rounded bg-slate-900 px-3 py-2 text-sm text-white">{message}</div>;
}
