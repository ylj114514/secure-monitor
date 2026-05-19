export default function CommandButton({
  label,
  description,
  onClick
}: {
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button className="command-button" onClick={onClick}>
      <strong>{label}</strong>
      <span>{description}</span>
    </button>
  );
}
