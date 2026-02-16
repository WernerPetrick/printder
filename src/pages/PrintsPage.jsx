import PrintsList from "../components/Prints/PrintsList";

export default function PrintsPage() {
  return (
    <div>
      <h2 style={{ textAlign: "center", color: "var(--fg)", margin: "24px 0 0", textTransform: "uppercase", letterSpacing: "2px", fontSize: "20px" }}>Your Printed Models</h2>
      <PrintsList />
    </div>
  );
}
