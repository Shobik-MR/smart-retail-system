import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function SalesChart({ sales }) {

    const dailySales = {};

    sales.forEach((sale) => {

        const date = new Date(sale.createdAt)
            .toLocaleDateString();

        if (!dailySales[date]) {
            dailySales[date] = 0;
        }

        dailySales[date] += sale.totalAmount;
    });

    const labels = Object.keys(dailySales);

    const data = {
        labels: labels,

        datasets: [
            {
                label: "Sales",
                data: labels.map(
                    (date) => dailySales[date]
                ),
                borderWidth: 2
            }
        ]
    };

    const options = {
        responsive: true,

        plugins: {
            legend: {
                display: true
            },

            title: {
                display: true,
                text: "Sales Overview"
            }
        }
    };

    return (
        <div>
            <h2>Sales Chart</h2>

            <Line
                data={data}
                options={options}
            />
        </div>
    );
}

export default SalesChart;