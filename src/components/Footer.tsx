const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground/60">
      <div className="max-w-7xl mx-auto section-padding py-8 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Spare Lube. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
