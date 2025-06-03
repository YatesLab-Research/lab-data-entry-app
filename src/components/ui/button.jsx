export function Button({ children, onClick, variant = 'primary' }) {
  const base = "px-4 py-2 rounded font-semibold";
  const styles = {
    primary: `${base} bg-blue-600 text-white hover:bg-blue-700`,
    secondary: `${base} bg-gray-200 text-black hover:bg-gray-300`,
  };
  return <button onClick={onClick} className={styles[variant]}>{children}</button>;
}
