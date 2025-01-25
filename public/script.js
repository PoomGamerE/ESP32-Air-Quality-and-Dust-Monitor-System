// Fetch the data from the API and update the UI
const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();

    if (data.length === 0) {
      // ถ้าไม่มีข้อมูล
      showNoDataMessage();
    } else {
      // ถ้ามีข้อมูล
      const latest = data[0];
      if (latest) {
        document.getElementById('temperature').innerText = latest.temperature.toFixed(1);
        document.getElementById('humidity').innerText = latest.humidity.toFixed(1);
        document.getElementById('dust_density').innerText = latest.dust_density.toFixed(1);
        document.getElementById('gas_level').innerText = latest.gas_level.toFixed(1);
      }

      // Update the chart
      updateChart(data);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    showErrorMessage();
  }
};

// Show "No Data" message when there is no data
const showNoDataMessage = () => {
  document.getElementById('temperature').innerText = "No Data";
  document.getElementById('humidity').innerText = "No Data";
  document.getElementById('dust_density').innerText = "No Data";
  document.getElementById('gas_level').innerText = "No Data";
  alert('No data available!');
};

// Show an error message if the API fails
const showErrorMessage = () => {
  document.getElementById('temperature').innerText = "Error";
  document.getElementById('humidity').innerText = "Error";
  document.getElementById('dust_density').innerText = "Error";
  document.getElementById('gas_level').innerText = "Error";
  alert('Failed to load data');
};

// Chart.js configuration
const ctx = document.getElementById('dataChart').getContext('2d');
const dataChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [], // Timestamps
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [],
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Humidity (%)',
        data: [],
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Dust Density (µg/m³)',
        data: [],
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Gas Level (ppm)',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      x: { title: { display: true, text: 'Timestamp' } },
      y: { title: { display: true, text: 'Value' } },
    },
  },
});

// Update the chart with fetched data
const updateChart = (data) => {
  const labels = data.map((item) => new Date(item.created_at).toLocaleTimeString());
  const temperatureData = data.map((item) => item.temperature);
  const humidityData = data.map((item) => item.humidity);
  const dustData = data.map((item) => item.dust_density);
  const gasData = data.map((item) => item.gas_level);

  dataChart.data.labels = labels;
  dataChart.data.datasets[0].data = temperatureData;
  dataChart.data.datasets[1].data = humidityData;
  dataChart.data.datasets[2].data = dustData;
  dataChart.data.datasets[3].data = gasData;

  dataChart.update();
};

// Fetch data initially and every 60 seconds
fetchData();
setInterval(fetchData, 60000);
