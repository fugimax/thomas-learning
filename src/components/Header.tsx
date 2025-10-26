interface HeaderProps {
  chapterTitle: string;
  onMenuClick: () => void;
}

export default function Header({ chapterTitle, onMenuClick }: HeaderProps) {
  return (
    <header className="bg-yellow-300 border-b-4 border-black p-4">
      <div className="flex items-center gap-4">
        <button
          id="openToc"
          className="text-2xl"
          aria-label="Menu"
          onClick={onMenuClick}
        >
          ☰
        </button>
        <h1 className="text-2xl md:text-3xl">{chapterTitle}</h1>
      </div>
    </header>
  );
}
