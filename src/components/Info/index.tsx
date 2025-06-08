import MaterialIcon from '../MaterialIcon';

type InfoProps = {
  title: string;
  content: string;
};

export default function Info({ title, content }: InfoProps) {
  return (
    <div className="bg-teal-100 border-2 border-teal-200 rounded-sm p-2 flex flex-col gap-3">
      <div className="flex flex-row gap-2 text-slate-400 items-center">
        <MaterialIcon name="info" />
        <span className="text-sm">{title}</span>
      </div>
      <span className="text-2xl text-slate-600 px-1 font-bolder">{content}</span>
    </div>
  );
}
