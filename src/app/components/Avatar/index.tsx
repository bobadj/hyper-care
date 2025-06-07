type AvatarProps = {
  name?: string;
};

export default function Avatar({ name = 'Slobodan Djordjevic' }: AvatarProps) {
  return (
    <div className="flex flex-row items-center gap-4">
      <span>{name}</span>
      <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold">
        {name.charAt(0)}
      </span>
    </div>
  );
}
