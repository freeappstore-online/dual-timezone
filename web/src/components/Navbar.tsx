export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white py-4 px-4 md:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Kiri: Judul Aplikasi (Gaya Font Converter) */}
        <h1 className="text-2xl md:text-xl font-serif font-bold text-gray-900 tracking-tight">
          Dual Timezone
        </h1>

        {/* Kanan: Tagline Platform */}
        <span className="text-sm text-gray-400 font-normal w-48 lg:w-fit">
          Part of FreeAppStore — free forever
        </span>
      </div>
    </header>
  );
}