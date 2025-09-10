import React from 'react'
import Navbar from '../components/Navbar'
import SmallReport from '../components/SmallReport'
import './Homepage.css'

const Homepage = () => {
  const [reports, setReports] = React.useState([
    {
      name: "Amit Sharma",
      post_time: "2 hours ago",
      report_title: "Flooding near Kahilipara"
    },
    {
      name: "Priya Das",
      post_time: "5 mins ago",
      report_title: "Streetlight not working at Chandmari"
    },
    {
      name: "Rohit Sen",
      post_time: "1 hour ago",
      report_title: "Garbage dump overflowing in Beltola"
    },
    {
      name: "Sneha Roy",
      post_time: "30 mins ago",
      report_title: "Broken footpath near Ganeshguri flyover"
    },
    {
      name: "Arjun Gupta",
      post_time: "10 hours ago",
      report_title: "Potholes causing traffic near Dispur"
    },
    {
      name: "Meera Joshi",
      post_time: "25 mins ago",
      report_title: "Drainage clogged in Ulubari area"
    },
    {
      name: "Rakesh Verma",
      post_time: "3 hours ago",
      report_title: "Illegal parking blocking road at Fancy Bazaar"
    },
    {
      name: "Kavita Singh",
      post_time: "15 mins ago",
      report_title: "Water leakage near Zoo Road"
    },
    {
      name: "Saurav Boro",
      post_time: "8 hours ago",
      report_title: "Damaged electric pole near Paltan Bazaar"
    },
    {
      name: "Nisha Ali",
      post_time: "50 mins ago",
      report_title: "Garbage collection delayed in Maligaon"
    },
    {
      name: "Aditya Kumar",
      post_time: "6 hours ago",
      report_title: "Open manhole near Silpukhuri"
    },
    {
      name: "Rituparna Goswami",
      post_time: "20 mins ago",
      report_title: "Street flooded after rain in Pan Bazaar"
    },
    {
      name: "Sanjay Patel",
      post_time: "2 days ago",
      report_title: "Broken traffic signal at Jalukbari"
    },
    {
      name: "Deepika Choudhury",
      post_time: "12 hours ago",
      report_title: "Garbage burning causing pollution in Basistha"
    },
    {
      name: "Ankit Mehta",
      post_time: "3 days ago",
      report_title: "Encroachment on footpath near Khanapara"
    },
    {
      name: "Manisha Deka",
      post_time: "40 mins ago",
      report_title: "Water supply disruption in Noonmati"
    },
    {
      name: "Rajiv Das",
      post_time: "7 hours ago",
      report_title: "Stray cattle blocking road near Narengi"
    },
    {
      name: "Pooja Sen",
      post_time: "1 min ago",
      report_title: "Garbage scattered near GS Road"
    },
    {
      name: "Vikram Thakur",
      post_time: "9 hours ago",
      report_title: "Noise pollution due to loudspeakers at Bharalumukh"
    },
    {
      name: "Shweta Paul",
      post_time: "4 hours ago",
      report_title: "Uncovered drains near Lokhra"
    }
  ]);

  return (
    <div className='homepage-container'>
      <Navbar />
      <div className='reports-grid'>
        {reports.map((report, idx) => {
          return(
            <>
              <SmallReport
              key={report.name + report.post_time + idx} 
              username={report.name} 
              post_time={report.post_time} 
              report_title={report.report_title}/>
            </>
          )
        })}
      </div>
    </div>
  )
}

export default Homepage
