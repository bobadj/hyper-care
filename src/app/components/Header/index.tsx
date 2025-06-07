import Avatar from '../Avatar';

export default function Header() {
  return (
    <header className="w-full h-16 px-6 flex items-center justify-between border-b border-neutral-200 bg-white shadow-sm">
      <div className="logo" />
      <Avatar />
    </header>
  );
}
