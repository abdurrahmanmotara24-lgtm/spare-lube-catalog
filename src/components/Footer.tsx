const Footer = () => {
  return (
    <footer className="bg-zinc-950">
      <div className="max-w-7xl mx-auto section-padding py-10 text-center">
        <p className="font-heading text-white/50 text-sm uppercase tracking-widest">
          © {new Date().getFullYear()} Spare Lube. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
