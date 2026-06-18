export default function Home() {
  return (
    <main style={{ minHeight: "100vh", padding: "48px", fontFamily: "Arial" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <p style={{ color: "#64748b" }}>
          Swedish tax estimate for UK CSOP options priced in USD
        </p>

        <h1 style={{ fontSize: "44px", marginBottom: "24px" }}>
          Swedish Tax Calculator for UK CSOP Options
        </h1>

        <p style={{ fontSize: "20px", lineHeight: 1.5 }}>
          Estimate Swedish income tax at exercise and Swedish capital gains tax
          at sale for UK CSOP options denominated in USD.
        </p>

        <section
          style={{
            marginTop: "32px",
            padding: "24px",
            border: "1px solid #e5e7eb",
            borderRadius: "16px"
          }}
        >
          <h2>Calculator coming soon</h2>
          <p>
            This calculator will estimate Swedish tax for Swedish tax residents
            holding UK CSOP options priced in USD.
          </p>
        </section>
      </div>
    </main>
  );
}
