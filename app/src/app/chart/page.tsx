"use client"

// pages/index.js
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { storeData , removeData, getData } from "../../../utils/localstorage";
import { useEffect ,useState } from "react";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);


export default function CommentDistribution() {
  const [loading, setLoading] = useState(false);
  const [totalCommentsMonthly, setTotalCommentsMonthly] = useState({});

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('total_comments_monthly');
      if (storedData) {
        setTotalCommentsMonthly(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Error parsing total_comments_monthly:", error);
    }
  }, []);

const months = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];


let january = totalCommentsMonthly["January"] || 0;
let february = totalCommentsMonthly["February"] || 0;
let march = totalCommentsMonthly["March"] || 0;
let april = totalCommentsMonthly["April"] || 0;
let may = totalCommentsMonthly["May"] || 0;
let june = totalCommentsMonthly["June"] || 0;
let july = totalCommentsMonthly["July"] || 0;
let august = totalCommentsMonthly["August"] || 0;
let september = totalCommentsMonthly["September"] || 0;
let october = totalCommentsMonthly["October"] || 0;
let november = totalCommentsMonthly["November"] || 0;
let december = totalCommentsMonthly["December"] || 0;

const allMonthsAreZero = january === 0 && february === 0 && march === 0 && april === 0 && may === 0 && june === 0 &&
july === 0 && august === 0 && september === 0 && october === 0 && november === 0 && december === 0;



  // Set loading state
  useEffect(() => {
    setLoading(allMonthsAreZero);
  }, [totalCommentsMonthly]);


// export default function CommentDistribution() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun" , "Jul" ,"Aug" ,"Sept" ,"Oct", "Nov","Dec" ],
    datasets: [
      {
        label: "Comments",
        data: [january, february, march, april, may, june ,july, august, september, october, november, december], // Example data
        backgroundColor: "rgba(138, 43, 226, 0.7)", // Purple shade
        borderRadius: 5,
        barThickness: 65, 
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        max:100,
        ticks:{
          stepSize:20,
        },
        
      },
    },
  };

  return (
    <div>
        <h1 className="text-center text-2xl"><strong>Comment Distribution</strong></h1>
      <div className="w-full h-[250px] px-4">
      {loading ? (
       <div style={{ textAlign: "center", padding: "20px" }}>
       <svg
         xmlns="http://www.w3.org/2000/svg"
         width="40"
         height="40"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
         className="animate-spin"
       >
         <circle cx="12" cy="12" r="10" />
         <path d="M12 2v4M12 22v-4M20.8 7.2l-3 3M3.2 7.2l3 3M20.8 16.8l-3-3M3.2 16.8l3-3" />
       </svg>
       <p>Loading Chart...</p>
     </div>
      ) : (
        <Bar data={data} options={options} />
      )}
      </div>
    </div>
  );
}
