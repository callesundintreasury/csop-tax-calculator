"use client";

import { useMemo, useState } from "react";

type TaxResult = {
  benefitPerShareUsd: number;
  totalBenefitUsd: number;
  totalBenefitSek: number;
  estimatedIncomeTaxSek: number;
  acquisitionCostPerShareUsd: number;
  capitalGainPerShareUsd: number;
  totalCapitalGainUsd: number;
  totalCapitalGainSek: number;
  estimatedCapitalGainsTaxSek: number;
  totalEstimatedTaxSek: number;
  netProceedsAfterTaxSek: number;
  warnings: string[];
};

function formatSek(value: number) {
  return new Intl.NumberFormat("en-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function Home() {
  const [optionsToExercise, setOptionsToExercise] = useState("10000");
  const [strikePriceUsd, setStrikePriceUsd] = useState("1");
  const [fairMarketValueUsd, setFairMarketValueUsd] = useState("4");
  const [salePriceUsd, setSalePriceUsd] = useState("6");
  const [usdSekAtExercise, setUsdSekAtExercise] = useState("10.5");
  const [usdSekAtSale, setUsdSekAtSale] = useState("10.7");
  const [marginalTaxRate, setMarginalTaxRate] = useState("50");
  const [feesSek, setFeesSek] = useState("0");

  const [workedInUk, setWorkedInUk] = useState(false);
  const [ukTaxResident, setUkTaxResident] = useState(false);
  const [ukTaxPaid, setUkTaxPaid] = useState(false);
  const [lessThanThreeYears, setLessThanThreeYears] = useState(false);
  const [moreThanTenYears, setMoreThanTenYears] = useState(false);

  const result: TaxResult = useMemo(() => {
    const options = toNumber(optionsToExercise);
    const strike = toNumber(strikePriceUsd);
    const fmv = toNumber(fairMarketValueUsd);
    const sale = toNumber(salePriceUsd);
    const fxExercise = toNumber(usdSekAtExercise);
    const fxSale = toNumber(usdSekAtSale);
    const incomeTaxRate = toNumber(marginalTaxRate) / 100;
    const fees = toNumber(feesSek);

    const benefitPerShareUsd = Math.max(0, fmv - strike);
    const totalBenefitUsd = options * benefitPerShareUsd;
    const totalBenefitSek = totalBenefitUsd * fxExercise;
    const estimatedIncomeTaxSek = totalBenefitSek * incomeTaxRate;

    const acquisitionCostPerShareUsd = strike + benefitPerShareUsd;

    const capitalGainPerShareUsd = sale - acquisitionCostPerShareUsd;
    const totalCapitalGainUsd = options * capitalGainPerShareUsd;
    const totalCapitalGainSek = totalCapitalGainUsd * fxSale - fees;
    const estimatedCapitalGainsTaxSek = Math.max(0, totalCapitalGainSek * 0.3);

    const grossSaleProceedsSek = options * sale * fxSale - fees;
    const totalEstimatedTaxSek =
      estimatedIncomeTaxSek + estimatedCapitalGainsTaxSek;

    const exerciseCostSek = options * strike * fxExercise;

    const netProceedsAfterTaxSek =
      grossSaleProceedsSek - exerciseCostSek - totalEstimatedTaxSek;

    const warnings: string[] = [
      "This calculator provides a preliminary Swedish tax estimate only. It is not tax advice.",
      "It does not determine whether your UK CSOP qualifies for UK tax-advantaged treatment.",
      "It does not calculate UK income tax, UK National Insurance, employer reporting obligations, or foreign tax credit relief.",
    ];

    if (workedInUk) {
      warnings.push(
        "You worked in the UK during the vesting period. UK tax and cross-border allocation may apply."
      );
    }

    if (ukTaxResident) {
      warnings.push(
        "You were UK tax resident between grant and exercise. UK tax exposure may need to be reviewed."
      );
    }

    if (ukTaxPaid) {
      warnings.push(
        "UK tax has been withheld or paid. You may need to consider double tax relief in Sweden."
      );
    }

    if (lessThanThreeYears) {
      warnings.push(
        "The option appears to have been exercised less than three years after grant. UK CSOP tax-advantaged treatment may be affected."
      );
    }

    if (moreThanTenYears) {
      warnings.push(
        "The option appears to have been exercised more than ten years after grant. UK CSOP tax-advantaged treatment may be affected."
      );
    }

    return {
      benefitPerShareUsd,
      totalBenefitUsd,
      totalBenefitSek,
      estimatedIncomeTaxSek,
      acquisitionCostPerShareUsd,
      capitalGainPerShareUsd,
      totalCapitalGainUsd,
      totalCapitalGainSek,
      estimatedCapitalGainsTaxSek,
      totalEstimatedTaxSek,
      netProceedsAfterTaxSek,
      warnings,
    };
  }, [
    optionsToExercise,
    strikePriceUsd,
    fairMarketValueUsd,
    salePriceUsd,
    usdSekAtExercise,
    usdSekAtSale,
    marginalTaxRate,
    feesSek,
    workedInUk,
    ukTaxResident,
    ukTaxPaid,
    lessThanThreeYears,
    moreThanTenYears,
  ]);

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.kicker}>UK CSOP options · Priced in USD · Swedish tax resident</p>

        <h1 style={styles.title}>
          Swedish Tax Calculator for UK CSOP Options
        </h1>

        <p style={styles.subtitle}>
          Estimate Swedish income tax at exercise and Swedish capital gains tax
          at sale for UK Company Share Option Plan options denominated in USD.
        </p>
      </section>

      <section style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Option assumptions</h2>

          <NumberField
            label="Options to exercise"
            value={optionsToExercise}
            onChange={setOptionsToExercise}
          />

          <NumberField
            label="Strike price per share (USD)"
            value={strikePriceUsd}
            onChange={setStrikePriceUsd}
          />

          <NumberField
            label="Fair market value at exercise per share (USD)"
            value={fairMarketValueUsd}
            onChange={setFairMarketValueUsd}
          />

          <NumberField
            label="Sale price per share (USD)"
            value={salePriceUsd}
            onChange={setSalePriceUsd}
          />

          <NumberField
            label="USD/SEK exchange rate at exercise"
            value={usdSekAtExercise}
            onChange={setUsdSekAtExercise}
          />

          <NumberField
            label="USD/SEK exchange rate at sale"
            value={usdSekAtSale}
            onChange={setUsdSekAtSale}
          />

          <NumberField
            label="Estimated Swedish marginal income tax rate (%)"
            value={marginalTaxRate}
            onChange={setMarginalTaxRate}
          />

          <NumberField
            label="Brokerage and transaction fees (SEK)"
            value={feesSek}
            onChange={setFeesSek}
          />
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>UK CSOP risk checklist</h2>

          <CheckboxField
            label="I worked in the UK during the vesting period"
            checked={workedInUk}
            onChange={setWorkedInUk}
          />

          <CheckboxField
            label="I was UK tax resident between grant and exercise"
            checked={ukTaxResident}
            onChange={setUkTaxResident}
          />

          <CheckboxField
            label="UK tax has been withheld or paid"
            checked={ukTaxPaid}
            onChange={setUkTaxPaid}
          />

          <CheckboxField
            label="The option was exercised less than three years after grant"
            checked={lessThanThreeYears}
            onChange={setLessThanThreeYears}
          />

          <CheckboxField
            label="The option was exercised more than ten years after grant"
            checked={moreThanTenYears}
            onChange={setMoreThanTenYears}
          />
        </div>
      </section>

      <section style={styles.resultsGrid}>
        <ResultCard
          title="Employment benefit at exercise"
          main={formatSek(result.totalBenefitSek)}
          rows={[
            ["Benefit per share", formatUsd(result.benefitPerShareUsd)],
            ["Total benefit", formatUsd(result.totalBenefitUsd)],
            ["Estimated income tax", formatSek(result.estimatedIncomeTaxSek)],
          ]}
        />

        <ResultCard
          title="Capital gain at sale"
          main={formatSek(result.totalCapitalGainSek)}
          rows={[
            [
              "Acquisition cost per share",
              formatUsd(result.acquisitionCostPerShareUsd),
            ],
            ["Capital gain per share", formatUsd(result.capitalGainPerShareUsd)],
            [
              "Estimated capital gains tax",
              formatSek(result.estimatedCapitalGainsTaxSek),
            ],
          ]}
        />

        <ResultCard
          title="Total estimated Swedish tax"
          main={formatSek(result.totalEstimatedTaxSek)}
          rows={[
            ["Income tax", formatSek(result.estimatedIncomeTaxSek)],
            [
              "Capital gains tax",
              formatSek(result.estimatedCapitalGainsTaxSek),
            ],
            [
              "Estimated net after exercise cost and tax",
              formatSek(result.netProceedsAfterTaxSek),
            ],
          ]}
        />
      </section>

      <section style={styles.warningCard}>
        <h2 style={styles.sectionTitle}>Important warnings</h2>
        <ul style={styles.warningList}>
          {result.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label style={styles.label}>
      <span>{label}</span>
      <input
        style={styles.input}
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label style={styles.checkboxLabel}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

function ResultCard({
  title,
  main,
  rows,
}: {
  title: string;
  main: string;
  rows: [string, string][];
}) {
  return (
    <div style={styles.resultCard}>
      <p style={styles.resultTitle}>{title}</p>
      <p style={styles.resultMain}>{main}</p>
      <div>
        {rows.map(([label, value]) => (
          <div key={label} style={styles.resultRow}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#020617",
    color: "white",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: "48px 20px",
  },
  hero: {
    maxWidth: 1100,
    margin: "0 auto 32px",
  },
  kicker: {
    color: "#38bdf8",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 48,
    lineHeight: 1.05,
    margin: "12px 0 20px",
    maxWidth: 900,
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: 20,
    lineHeight: 1.6,
    maxWidth: 850,
  },
  grid: {
    maxWidth: 1100,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 20,
  },
  card: {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: 20,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 22,
    marginTop: 0,
    marginBottom: 20,
  },
  label: {
    display: "grid",
    gap: 8,
    marginBottom: 16,
    color: "#cbd5e1",
    fontSize: 14,
  },
  input: {
    width: "100%",
    borderRadius: 12,
    border: "1px solid #334155",
    background: "#020617",
    color: "white",
    padding: "12px 14px",
    fontSize: 16,
    boxSizing: "border-box",
  },
  checkboxLabel: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    color: "#cbd5e1",
    marginBottom: 16,
    lineHeight: 1.5,
  },
  resultsGrid: {
    maxWidth: 1100,
    margin: "20px auto 0",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
  },
  resultCard: {
    background: "#111827",
    border: "1px solid #334155",
    borderRadius: 20,
    padding: 24,
  },
  resultTitle: {
    color: "#94a3b8",
    margin: 0,
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 700,
  },
  resultMain: {
    fontSize: 34,
    fontWeight: 800,
    margin: "12px 0 20px",
  },
  resultRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    borderTop: "1px solid #1e293b",
    padding: "12px 0",
    color: "#cbd5e1",
  },
  warningCard: {
    maxWidth: 1100,
    margin: "20px auto 0",
    background: "#451a03",
    border: "1px solid #92400e",
    borderRadius: 20,
    padding: 24,
  },
  warningList: {
    color: "#fed7aa",
    lineHeight: 1.6,
    marginBottom: 0,
  },
};
