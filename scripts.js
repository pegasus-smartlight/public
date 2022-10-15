// ***** First Graph - two sets *****
// setup block first
const data = {
  // xAxios
  labels: [
    "7h",
    "8h",
    "9h",
    "10h",
    "11h",
    "12h",
    "13h",
    "14h",
    "15h",
    "16h",
    "17h",
    "18h",
    "19h",
  ],
  datasets: [
    // multiple datasets
    {
      label: "Consumo Existente",
      data: [],
      borderWidth: 1,
      showLine: true,
      spanGaps: true,
      pointStyle: "circle",
      pointRadius: 10,
      pointHoverRadius: 15,
      borderColor: "rgba(255,0,0,1.0)",
      backgroundColor: "rgba(255,0,0,1.0)",
    },
    {
      label: "Consumo Smart Light",
      data: [],
      borderWidth: 1,
      showLine: true,
      spanGaps: true,
      pointStyle: "circle",
      pointRadius: 10,
      pointHoverRadius: 15,
      borderColor: "rgba(13,202,80,0.4)",
      backgroundColor: "rgba(13,202,80,0.4)",
    },
  ],
};
// config block first
const config = {
  type: "line",
  data,
  options: {
    scales: {
      y: {
        beginAtZero: true,
        max: 75,
        min: 0,
        ticks: {
          stepSize: 25,
          callback: (v, i, _) => {
            return v + " W";
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        align: "center",
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
    responsive: false,
    maintainAspectRatio: false,
  },
};

// ***** Second Graph - one set *****
// setup block second
const dataSecondGraph = {
  labels: [
    "7h",
    "8h",
    "9h",
    "10h",
    "11h",
    "12h",
    "13h",
    "14h",
    "15h",
    "16h",
    "17h",
    "18h",
    "19h",
  ],
  datasets: [
    {
      label: "Consumo diário de Energia",
      data: [],
      borderWidth: 1,
      showLine: true,
      spanGaps: true,
      pointStyle: "circle",
      pointRadius: 10,
      pointHoverRadius: 15,
      borderColor: "rgba(15, 71, 238, 0.8)",
      backgroundColor: "rgba(15, 71, 238, 0.8)",
    },
  ],
};
// config block second
const configSecondGraph = {
  type: "line",
  data: dataSecondGraph,
  options: {
    scales: {
      y: {
        beginAtZero: true,
        max: 0.08,
        ticks: {
          callback: (v, i, _) => {
            return v + " kWh";
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        align: "center",
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
    responsive: false,
    maintainAspectRatio: false,
  },
};

// both render init block
const consumptionComparisonChart = new Chart(
  document.getElementById("chart-one"),
  config
);
const DailyEnergyConsumption = new Chart(
  document.getElementById("chart-two"),
  configSecondGraph
);

// global variables - core domain
const responseESP32 = [10, 15, 15, 25, 30, 30, 25, 40, 45, 50, 60, 65, 70];
const currentConsumption = new Array(13).fill(70);

// call functions and handle objects
const averageConsumption = (watt, hour, wattListCopy) => {
  /* formula provided in spreadsheet -> xls(fx): =((B2)/2) || =((B2+B3)/2) */

  const amount = 2;
  let oneHourBeforeAvg = wattListCopy[hour - 1];

  return hour > 0 ? (watt + oneHourBeforeAvg) / amount : watt / amount;
};

const perHour = (v) => v / 1000;

const wattsHour = responseESP32.map(averageConsumption).map(perHour);

const dataset = {
  currentConsumption:
    consumptionComparisonChart.config._config.data.datasets[0].data,
  smartLightConsumption:
    consumptionComparisonChart.config._config.data.datasets[1].data,
  dailyConsumption: DailyEnergyConsumption.config._config.data.datasets[0].data,
};

function init() {
  return setInterval(() => {
    if (responseESP32.length)
      return plot(
        responseESP32,
        dataset.smartLightConsumption,
        dataset.dailyConsumption,
        dataset.currentConsumption
      );
  }, 3600000);
}

function plot(values, smartAxis, dailyAxis, currentAxis) {
  if (values.length) {
    smartAxis.push(values.shift());
    dailyAxis.push(wattsHour.shift());
    currentAxis.push(currentConsumption.shift());

    consumptionComparisonChart.update();
    DailyEnergyConsumption.update();
    return true;
  }
  return false;
}

init();
