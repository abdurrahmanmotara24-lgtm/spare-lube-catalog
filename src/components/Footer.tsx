const Footer = () => {
  return (
    <footer className="bg-foreground">
      <div className="max-w-7xl mx-auto section-padding py-10 text-center">
        <p className="font-heading text-primary-foreground/40 text-sm uppercase tracking-widest">
          © {new Date().getFullYear()} Spare Lube. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
