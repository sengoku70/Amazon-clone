export default function Rating({ value }) {
  return (
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <span key={i}>{i < value ? "★" : "☆"}</span>
      ))}
    </div>
  );
}
