import React from "react";
import ReactApexChart from "react-apexcharts";

interface PieChartProps {
  chartData: any;
  chartOptions: any;
  height?: string;
  width?: string;
}

function PieChart(props: PieChartProps) {
  const { chartData, chartOptions, height, width } = props;
  return (
    <ReactApexChart
      options={chartOptions}
      series={chartData}
      type="pie"
      width={width || "100%"}
      height={height || "55%"}
    />
  );
}

export default PieChart;
