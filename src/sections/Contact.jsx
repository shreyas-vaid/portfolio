import ConnectionTerminal from "../components/ConnectionTerminal";

export default function Contact() {
  return (
    <section
      id="contact"
      style={{
        padding: "6rem 2rem 8rem",
        maxWidth: "1240px",
        width: "100%",
        margin: "0 auto",
        position: "relative",
        boxSizing: "border-box",
        overflowX: "hidden"
      }}
    >
      {/* Section Header */}
      <div className="section-header-block">
        <div className="section-pretitle">07 // ENCRYPTED DISPATCH</div>
        <h2 className="section-main-title">CONNECTION TERMINAL</h2>
        <p className="section-subtitle">
          Establish an encrypted transmission channel for full-time engineering roles, high-impact freelance projects, or technical collaborations.
        </p>
      </div>

      <ConnectionTerminal />
    </section>
  );
}
