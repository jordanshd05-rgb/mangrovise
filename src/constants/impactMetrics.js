export const IMPACT_METRICS = {
  co2Kg: {
    key: "co2Kg",
    label: "Karbon Tersimpan",
    unit: "kg CO2",
    value: 12.3,
    description: "Penyerapan karbon per tahun",
  },
  coastalMeter: {
    key: "coastalMeter",
    label: "Garis Pantai Terlindungi",
    unit: "Meter",
    value: 0.5,
    description: "Perlindungan pantai yang terjaga",
  },
  habitatSqM: {
    key: "habitatSqM",
    label: "Habitat Nursery Ikan/Kepiting",
    unit: "m²",
    value: 2.5,
    description: "Area habitat ekosistem pesisir",
  },
  speciesEstimate: {
    key: "speciesEstimate",
    label: "Keanekaragaman Spesies",
    unit: "Spesies",
    value: 0.2,
    description: "Estimasi spesies yang kembali",
  },
};

export function calculateMultiImpact(unitFactor = 1) {
  return {
    co2Kg: Number((IMPACT_METRICS.co2Kg.value * unitFactor).toFixed(1)),
    coastalMeter: Number((IMPACT_METRICS.coastalMeter.value * unitFactor).toFixed(1)),
    habitatSqM: Number((IMPACT_METRICS.habitatSqM.value * unitFactor).toFixed(1)),
    speciesEstimate: Number((IMPACT_METRICS.speciesEstimate.value * unitFactor).toFixed(1)),
  };
}
