export type YearData = {
  year: number;
  population?: number;
  cement_co2?: number;
  cement_co2_per_capita?: number;
  cumulative_cement_co2?: number;
  coal_co2?: number;
  coal_co2_per_capita?: number;
  cumulative_coal_co2?: number;
  gas_co2?: number;
  gas_co2_per_capita?: number;
  cumulative_gas_co2?: number;
  oil_co2?: number;
  oil_co2_per_capita?: number;
  cumulative_oil_co2?: number;
  co2?: number;
  co2_per_capita?: number;
  cumulative_co2?: number;
  methane?: number;
  methane_per_capita?: number;
  nitrous_oxide?: number;
  nitrous_oxide_per_capita?: number;
  temperature_change_from_co2?: number;
  total_ghg?: number;
  total_ghg_per_capita?: number;
  share_global_co2?: number;
  cumulative_share_global_co2?: number;
  co2_growth_prct?: number;
  co2_growth_abs?: number;
  co2_per_gdp?: number;
  co2_per_unit_energy?: number;
  energy_per_capita?: number;
  energy_per_gdp?: number;
  ghg_per_capita?: number;
  ghg_growth_prct?: number;
  greenhouse_gas_emissions?: number;
  greenhouse_gas_emissions_per_capita?: number;
  cumulative_greenhouse_gas_emissions?: number;
  cumulative_greenhouse_gas_emissions_per_capita?: number;
  share_global_cumulative_co2?: number;
  share_global_cumulative_co2_excluding_lucf?: number;
  region?: string;
  income_group?: string;
  iso_code?: string;
};

export type Country = {
  id: string;
  iso_code?: string;
  data: YearData[];
};

export type ColumnOption = {
  key: string;
  label: string;
  category: 'basic' | 'additional';
};
