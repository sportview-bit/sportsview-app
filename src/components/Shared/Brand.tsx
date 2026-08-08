export function Brand() {
  return (
    <div className="flex items-center gap-2">
      {/* Small Logo like YouTube/Instagram (32x32) */}
      <img
        src="/logo.jpg"
        alt="Logo"
        className="w-8 h-8 object-cover rounded-full border border-amber-500/50 shadow-sm"
      />

      {/* Fantastic, neat font for the title */}
      <h1
        className="text-xl tracking-wide bg-gradient-to-r from-amber-300 via-amber-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-sm"
        style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900 }}
      >
        SPORTSVIEWTZ
      </h1>
    </div>
  );
}