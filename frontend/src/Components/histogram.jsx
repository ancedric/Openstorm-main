import PropTypes from 'prop-types';
import { useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto';

const HistogramComponent = ({ salesData, labels, labTitle }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null); // useRef to persist Chart instance across renders

    useEffect(() => {
        if (chartRef.current) {
            // Destruction du graphique existant s'il existe
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            chartInstanceRef.current = new Chart(chartRef.current, { // Création du nouveau graphique
                type: 'line',
                data: {
                    labels,
                    datasets: [
                        {
                            label: labTitle,
                            fill: true,
                            backgroundColor: 'rgba(75,192,192,0.2)',
                            borderColor: 'rgba(75,192,192,1)',
                            borderWidth: 1,
                            hoverBackgroundColor: 'rgba(75,192,192,0.4)',
                            hoverBorderColor: 'rgba(75,192,192,1)',
                            tension: 0.4,
                            data: salesData,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            ticks: {
                                beginAtZero: true,
                            },
                        },
                        x: {
                            ticks: {
                                type: 'linear',
                            },
                        },
                    },
                },
            });

            const ctx = chartInstanceRef.current.canvas.getContext('2d');
            const gradient = ctx.createLinearGradient(0, 0, 0, chartInstanceRef.current.height);
            gradient.addColorStop(0, 'rgba(188, 235, 200, 0.2)');
            gradient.addColorStop(1, 'rgba(7,36,181, 0.6)');
            chartInstanceRef.current.data.datasets[0].backgroundColor = gradient;
            chartInstanceRef.current.update(); // apply the updated background
        }

        return () => { // Fonction de nettoyage (cleanup)
          if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy(); // Destruction du graphique lors du démontage du composant
            chartInstanceRef.current = null;
          }
        };
    }, [labTitle, labels, salesData]);

    return <canvas ref={chartRef} />;
};

HistogramComponent.propTypes = {
    salesData: PropTypes.arrayOf(PropTypes.number),
    labels: PropTypes.arrayOf(PropTypes.string),
    labTitle: PropTypes.string.isRequired,
};

export default HistogramComponent;