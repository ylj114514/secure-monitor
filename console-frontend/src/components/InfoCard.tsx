export default function InfoCard({
  title,
  description,
  items = [],
}: {
  title: string;
  description: string;
  items?: string[];
}) {
  return (
    <div className="info-card">
      <h3>{title}</h3>
      <p>{description}</p>
      {!!items.length && (
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
