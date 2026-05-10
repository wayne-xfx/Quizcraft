document.addEventListener('DOMContentLoaded', () => {
    
    // Find the canvas element inside your admin-dashboard.html
    const chartCanvas = document.getElementById('usersChart');
    
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');

        // Create the vertical neon gradient fill for under the line
        let gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(0, 229, 255, 0.2)'); // Cyan at the top
        gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');   // Transparent at bottom

        /*
         * =========================================================
         * BACKEND NOTE: Dynamic Chart Data Integration
         * To make this chart dynamic, you should fetch the data via 
         * an API call (e.g., fetch('/api/analytics/new-users')) 
         * right here BEFORE initializing the new Chart.
         * Then, pass the dynamic arrays into 'labels' and 'data'.
         * =========================================================
         */

        // Initialize the line chart
        new Chart(ctx, {
            type: 'line', 
            data: {
                // BACKEND NOTE: Replace this array with dynamic dates/labels from the database
                labels: ['April 1', 'April 5', 'April 10', 'April 15', 'April 20', 'April 25', 'April 30'],
                datasets: [{
                    label: 'New Users',
                    // BACKEND NOTE: Replace this array with the actual daily registration counts 
                    data: [8, 12, 6, 15, 18, 14, 23], 
                    
                    // Line Styling
                    borderColor: '#00e5ff', 
                    borderWidth: 2,
                    
                    // Data Point (Dot) Styling
                    pointBackgroundColor: '#00e5ff',
                    pointBorderColor: '#0b1518',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    
                    // Straight lines between points
                    tension: 0, 
                    
                    // Background glow
                    fill: true,
                    backgroundColor: gradient
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, 
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(11, 21, 24, 0.9)',
                        titleColor: '#00e5ff',
                        bodyColor: '#ffffff',
                        borderColor: '#00e5ff',
                        borderWidth: 1,
                        padding: 10
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        // BACKEND NOTE: Either remove this 'max' property so Chart.js scales automatically based on the data, 
                        // or calculate it dynamically (e.g., highest data point + 10%) so the chart never cuts off.
                        max: 24,
                        ticks: {
                            stepSize: 6,
                            color: '#00e5ff',
                            font: { size: 11 }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        }
                    },
                    x: {
                        ticks: {
                            color: '#00e5ff',
                            font: { size: 11 }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        }
                    }
                }
            }
        });
    }
});