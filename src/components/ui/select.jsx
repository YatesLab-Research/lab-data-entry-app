export function Select({ children, name, value, onChange }) {
  return (
    <select name={name} value={value} onChange={onChange} className="border rounded p-2 w-full">
      {children}
    </select>
  );
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}
