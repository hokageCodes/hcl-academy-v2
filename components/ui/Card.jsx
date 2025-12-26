// Simple Card component using shadcn and design system
export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-primary border border-accent-light/10 rounded-2xl shadow-card p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2 hover:shadow-glass ${className}`}>
      {children}
    </div>
  );
}
