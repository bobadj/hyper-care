import classNames from 'classnames';

type MaterialIconProps = {
  name: string;
  cursor?: boolean;
  onClick?: () => void;
};

export default function MaterialIcon({
  name,
  cursor = false,
  onClick,
}: MaterialIconProps) {
  return (
    <span
      onClick={onClick}
      className={classNames('material-symbols-outlined', {
        'cursor-pointer': cursor || onClick,
      })}
    >
      {name}
    </span>
  );
}
