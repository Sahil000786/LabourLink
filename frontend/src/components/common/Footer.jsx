const Footer = () => {
  return (
    <footer className="ll-footer">
      <div className="ll-footer-inner">
        <span>© {new Date().getFullYear()} LabourLink. All rights reserved.</span>
        <span>Connecting local workers with local opportunities.</span>
      </div>
    </footer>
  );
};

export default Footer;
