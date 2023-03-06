interface CardProps {
  children: React.ReactNode
}

export default function Card(props:CardProps) {
  return (
    <div className="flex justify-center">
      <div className="card">
        <div className="py-5">
          {props.children}
        </div>
      </div>
    </div>
  );
}
