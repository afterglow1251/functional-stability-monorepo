export const htmlString: string = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Monitoring Charts</title>
    <script src="https://cdn.jsdelivr.net/npm/alpinejs@2.8.2" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
      canvas {
        width: 100% !important;
        height: auto !important;
      }

      .chart-container {
        width: 100%;
        max-width: 500px;
        margin: 50px auto 2rem;
      }

      .loading-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100%;
        z-index: 9999;
      }

      .spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 2s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .tab-list {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .tab-list button {
        padding: 0.5rem 1rem;
        border: none;
        background: #eee;
        border-radius: 5px;
        cursor: pointer;
      }

      .tab-list button.active {
        background-color: #3498db;
        color: white;
      }

      .processes-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        margin: 20px;
        margin-top: 50px;
      }

      .process-card {
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition:
          transform 0.3s ease,
          box-shadow 0.3s ease;
      }

      .process-card strong {
        font-size: 1.1em;
      }

      .process-card p {
        margin: 5px 0;
      }
    </style>
  </head>
  <body>
    <div x-data="monitoringData()" x-init="loadData()" class="container">
      <!-- Tabs navigation -->
      <nav>
        <ul
          class="tab-list"
          role="tablist"
          style="list-style-type: none; padding-left: 0"
        >
          <li>
            <button
              @click="activeTab = 'cpu'"
              :class="{active: activeTab === 'cpu'}"
            >
              CPU
            </button>
          </li>
          <li>
            <button
              @click="activeTab = 'memory'"
              :class="{active: activeTab === 'memory'}"
            >
              Memory
            </button>
          </li>
          <li>
            <button
              @click="activeTab = 'disk'"
              :class="{active: activeTab === 'disk'}"
            >
              Disk
            </button>
          </li>
          <li>
            <button
              @click="activeTab = 'process'"
              :class="{active: activeTab === 'process'}"
            >
              Processes
            </button>
          </li>
        </ul>
      </nav>

      <div x-show="loading" class="loading-spinner">
        <div class="spinner"></div>
      </div>

      <div x-show="activeTab === 'cpu'" class="chart-container">
        <canvas id="cpuChart" x-show="!loading"></canvas>
      </div>

      <div x-show="activeTab === 'memory'" class="chart-container">
        <canvas id="memoryChart" x-show="!loading"></canvas>
      </div>

      <div x-show="activeTab === 'disk'" class="chart-container">
        <canvas id="diskChart" x-show="!loading"></canvas>
      </div>

      <div x-show="activeTab === 'process' && processes.length > 0">
        <div class="processes-container">
          <template x-for="process in processes" :key="process.pid">
            <div class="process-card">
              <p>
                <strong>Process: </strong>
                <span x-text="process.proc"></span>
              </p>
              <p><strong>PID:</strong> <span x-text="process.pid"></span></p>
              <p>
                <strong>CPU Usage:</strong>
                <span x-text="process.cpu.toFixed(2)"></span>%
              </p>
              <p>
                <strong>Memory Usage:</strong>
                <span x-text="process.mem.toFixed(2)"></span>%
              </p>
            </div>
          </template>
        </div>
      </div>

<script>
  function monitoringData() {
    return {
      cpu: [],
      memory: [],
      disk: [],
      processes: [],
      cpuHistory: [],
      memoryHistory: [],
      diskHistory: [],
      loading: true,
      activeTab: 'cpu',

      async loadData() {
        try {
          this.loading = true;
          
          // Отримуємо поточні дані
          const response = await fetch('/v1/system-monitoring/all');
          const data = await response.json();
          this.cpu = data.cpu;
          this.memory = data.memory;
          this.disk = data.disk;
          this.processes = data.processLoad;

          // Отримуємо історичні дані
          const historicalResponse = await fetch('/v1/system-monitoring/historical');
          const historicalData = await historicalResponse.json();
          this.cpuHistory = historicalData.cpu;
          this.memoryHistory = historicalData.memory;
          this.diskHistory = historicalData.disk;

          this.renderCharts();
          this.loading = false;
        } catch (error) {
          console.error('Error fetching data:', error);
          this.loading = false;
        }
      },

      renderCharts() {
        // Графік для CPU
        new Chart(document.getElementById('cpuChart'), {
          type: 'line',
          data: {
            labels: this.cpuHistory.map((_, index) => index), // Мітки часу (індекси)
            datasets: [
              {
                label: 'CPU Load History',
                data: this.cpuHistory, // Дані історії
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => tooltipItem.raw.toFixed(2) + '%',
                },
              },
            },
          },
        });

        // Графік для Memory
        new Chart(document.getElementById('memoryChart'), {
          type: 'line',
          data: {
            labels: this.memoryHistory.map((_, index) => index), // Мітки часу
            datasets: [
              {
                label: 'Memory Usage History (GB)',
                data: this.memoryHistory.map((memory) => memory.used / 1073741824), // Переведення в GB
                borderColor: 'rgba(54, 162, 235, 1)',
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => tooltipItem.raw.toFixed(2) + ' GB',
                },
              },
            },
          },
        });

        // Графік для Disk
        new Chart(document.getElementById('diskChart'), {
          type: 'line',
          data: {
            labels: this.diskHistory.map((_, index) => index), // Мітки часу
            datasets: [
              {
                label: 'Disk Usage History (%)',
                data: this.diskHistory.map((disk) => disk.use),
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => tooltipItem.raw.toFixed(2) + '%',
                },
              },
            },
          },
        });
      },
    };
  }
</script>

    </div>
  </body>
</html>
`;
