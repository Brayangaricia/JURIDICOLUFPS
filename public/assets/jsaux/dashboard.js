const canvas = document.getElementById('graficadashboard').getContext('2d');
console.log(canvas)

const data = {

}

var char = new Chart(canvas, {
    type: 'line',
    data: {
        labels: ['Enero', 'Febero', 'Marzo', 'Abril', '', '', '', '', '', '', '', '', '',],
        datasets: [
            {
                label: 'Validando',
                backgroundColor: 'rgba(75, 209, 28, 0.4)',
                bordercolor: 'rgb(75, 209, 28)',
                data: [12, 52, 10, 100],
                tension: 0.5
            },
            {
                label: 'Validando2',
                backgroundColor: 'rgba(209, 45, 45, 0.4)',
                data: [62, 30, 10, 65]
            }
        ]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
})
console.log(char);