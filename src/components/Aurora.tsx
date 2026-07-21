export default function Aurora() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <i
        className="absolute rounded-full opacity-40 blur-[110px] motion-safe:animate-[aurora-a_9s_ease-in-out_infinite]"
        style={{
          width: "54vmax",
          height: "54vmax",
          top: "-22vmax",
          right: "-16vmax",
          background: "radial-gradient(circle, rgba(255,183,3,.34), transparent 65%)",
        }}
      />
      <i
        className="absolute rounded-full opacity-40 blur-[110px] motion-safe:animate-[aurora-b_11s_ease-in-out_infinite]"
        style={{
          width: "44vmax",
          height: "44vmax",
          bottom: "-18vmax",
          left: "-14vmax",
          background: "radial-gradient(circle, rgba(255,110,30,.18), transparent 65%)",
        }}
      />
      <i
        className="absolute rounded-full opacity-40 blur-[110px] motion-safe:animate-[aurora-c_13s_ease-in-out_infinite]"
        style={{
          width: "30vmax",
          height: "30vmax",
          top: "38%",
          left: "42%",
          background: "radial-gradient(circle, rgba(255,183,3,.14), transparent 60%)",
        }}
      />
    </div>
  );
}
