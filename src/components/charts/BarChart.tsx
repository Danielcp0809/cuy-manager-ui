import React from "react";
import Chart from "react-apexcharts";

interface BarChartPropsInterface {
    chartData: any;
    chartOptions: any;
}

function BarChart(props: BarChartPropsInterface) {
  const { chartData, chartOptions } = props;
  return (
    <Chart
      options={chartOptions}
      series={chartData}
      type="bar"
      width="100%"
      height="100%"
    />
  );
}

export default BarChart;
