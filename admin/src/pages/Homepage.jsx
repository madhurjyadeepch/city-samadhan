import React from 'react'
import Navbar from '../components/Navbar'
import SmallReport from '../components/SmallReport'
import './Homepage.css'
import { useNavigate } from 'react-router-dom'
import Stats from '../components/Stats'
import CommentBox from '../components/CommentBox'

const Homepage = () => {

  const [pageNumber, setPageNumber] = React.useState(1)
  
  const [reports, setReports] = React.useState([
    {
      name: "Amit Sharma",
      post_time: "2 hours ago",
      report_title: "Flooding near Kahilipara",
      status: "resolved",
      upvotes: 120,
      downvotes: 15,
      comments: [
        { id: 1, comment: "This needs urgent attention!" },
        { id: 2, comment: "Roads are completely blocked." }
      ],
      image: "https://www.aljazeera.com/wp-content/uploads/2024/08/AFP__20240823__36EM9XC__v1__HighRes__BangladeshWeatherFlood-1724392248.jpg"
    },
    {
      name: "Priya Das",
      post_time: "5 mins ago",
      report_title: "Streetlight not working at Chandmari",
      status: "inprogress",
      upvotes: 34,
      downvotes: 4,
      comments: [
        { id: 1, comment: "Very unsafe at night." },
        { id: 2, comment: "Please fix quickly." }
      ],
      image: "https://media.istockphoto.com/id/598171880/photo/broken-lamp.jpg?s=612x612&w=0&k=20&c=4LjHvpVxg0VUttmbWQtYBF5cS7R_9GVyTuKcXcEJCjw="
    },
    {
      name: "Rohit Sen",
      post_time: "1 hour ago",
      report_title: "Garbage dump overflowing in Beltola",
      status: "acknowledged",
      upvotes: 89,
      downvotes: 20,
      comments: [
        { id: 1, comment: "Smell is unbearable." },
        { id: 2, comment: "Health hazard for kids." }
      ],
      image: "https://media.istockphoto.com/id/639450178/video/landfill-with-garbage-trucks-unloading-junk.jpg?s=640x640&k=20&c=WTTDWSY340YVNKUhXrvIuUk9sMCTVQS9Z9ADHXqlQjY="
    },
    {
      name: "Sneha Roy",
      post_time: "30 mins ago",
      report_title: "Broken footpath near Ganeshguri flyover",
      status: "submitted",
      upvotes: 42,
      downvotes: 3,
      comments: [
        { id: 1, comment: "Almost tripped today." }
      ],
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5-FVTaV0BMozhjGqEHMEP4sFLLD6i3kuwTQ&s"
    },
    {
      name: "Arjun Gupta",
      post_time: "10 hours ago",
      report_title: "Potholes causing traffic near Dispur",
      status: "inprogress",
      upvotes: 76,
      downvotes: 12,
      comments: [
        { id: 1, comment: "Accidents waiting to happen." },
        { id: 2, comment: "Traffic jam daily." }
      ],
      image: "https://www.hindustantimes.com/ht-img/img/2023/09/20/1600x900/gege_akutami_1695225795670_1695225816461.jpg"
    },
    {
      name: "Meera Joshi",
      post_time: "25 mins ago",
      report_title: "Drainage clogged in Ulubari area",
      status: "acknowledged",
      upvotes: 53,
      downvotes: 9,
      comments: [
        { id: 1, comment: "Mosquitoes breeding here." }
      ],
      image: "https://www.hindustantimes.com/ht-img/img/2023/09/20/1600x900/gege_akutami_1695225795670_1695225816461.jpg"
    },
    {
      name: "Rakesh Verma",
      post_time: "3 hours ago",
      report_title: "Illegal parking blocking road at Fancy Bazaar",
      status: "submitted",
      upvotes: 61,
      downvotes: 22,
      comments: [
        { id: 1, comment: "Ambulance got stuck here." },
        { id: 2, comment: "Police should act." }
      ],
      image: "https://www.hindustantimes.com/ht-img/img/2023/09/20/1600x900/gege_akutami_1695225795670_1695225816461.jpg"
    },
    {
      name: "Kavita Singh",
      post_time: "15 mins ago",
      report_title: "Water leakage near Zoo Road",
      status: "inprogress",
      upvotes: 47,
      downvotes: 5,
      comments: [
        { id: 1, comment: "So much water being wasted!" }
      ],
      image: "https://www.hindustantimes.com/ht-img/img/2023/09/20/1600x900/gege_akutami_1695225795670_1695225816461.jpg"
    },
    {
      name: "Saurav Boro",
      post_time: "8 hours ago",
      report_title: "Damaged electric pole near Paltan Bazaar",
      status: "acknowledged",
      upvotes: 84,
      downvotes: 17,
      comments: [
        { id: 1, comment: "This is dangerous during rains." }
      ],
      image: "https://www.hindustantimes.com/ht-img/img/2023/09/20/1600x900/gege_akutami_1695225795670_1695225816461.jpg"
    },
    {
      name: "Nisha Ali",
      post_time: "50 mins ago",
      report_title: "Garbage collection delayed in Maligaon",
      status: "resolved",
      upvotes: 29,
      downvotes: 2,
      comments: [
        { id: 1, comment: "Collection resumed today." }
      ],
      image: "https://www.hindustantimes.com/ht-img/img/2023/09/20/1600x900/gege_akutami_1695225795670_1695225816461.jpg"
    },
    {
      name: "Aditya Kumar",
      post_time: "6 hours ago",
      report_title: "Open manhole near Silpukhuri",
      status: "submitted",
      upvotes: 65,
      downvotes: 14,
      comments: [
        { id: 1, comment: "Kids could fall inside." }
      ],
      image: "https://www.hindustantimes.com/ht-img/img/2023/09/20/1600x900/gege_akutami_1695225795670_1695225816461.jpg"
    },
    {
      name: "Rituparna Goswami",
      post_time: "20 mins ago",
      report_title: "Street flooded after rain in Pan Bazaar",
      status: "submitted",
      upvotes: 58,
      downvotes: 11,
      comments: [
        { id: 1, comment: "Cars got stuck here today." }
      ],
      image: "https://www.hindustantimes.com/ht-img/img/2023/09/20/1600x900/gege_akutami_1695225795670_1695225816461.jpg"
    },
    {
      name: "Sanjay Patel",
      post_time: "2 days ago",
      report_title: "Broken traffic signal at Jalukbari",
      status: "acknowledged",
      upvotes: 33,
      downvotes: 6,
      comments: [
        { id: 1, comment: "Traffic police handling manually." }
      ],
      image: "https://www.hindustantimes.com/ht-img/img/2023/09/20/1600x900/gege_akutami_1695225795670_1695225816461.jpg"
    },
    {
      name: "Deepika Choudhury",
      post_time: "12 hours ago",
      report_title: "Garbage burning causing pollution in Basistha",
      status: "submitted",
      upvotes: 72,
      downvotes: 18,
      comments: [
        { id: 1, comment: "Smoke everywhere!" },
        { id: 2, comment: "Asthma patients suffering." }
      ],
      image: "https://www.hindustantimes.com/ht-img/img/2023/09/20/1600x900/gege_akutami_1695225795670_1695225816461.jpg"
    },
    {
      name: "Ankit Mehta",
      post_time: "3 days ago",
      report_title: "Encroachment on footpath near Khanapara",
      status: "resolved",
      upvotes: 40,
      downvotes: 5,
      comments: [
        { id: 1, comment: "Footpath cleared today." }
      ],
      image: "https://www.hindustantimes.com/ht-img/img/2023/09/20/1600x900/gege_akutami_1695225795670_1695225816461.jpg"
    },
    {
      name: "Manisha Deka",
      post_time: "40 mins ago",
      report_title: "Water supply disruption in Noonmati",
      status: "inprogress",
      upvotes: 52,
      downvotes: 10,
      comments: [
        { id: 1, comment: "Haven’t had water since morning." }
      ],
      image: "https://www.hindustantimes.com/ht-img/img/2023/09/20/1600x900/gege_akutami_1695225795670_1695225816461.jpg"
    },
    {
      name: "Rajiv Das",
      post_time: "7 hours ago",
      report_title: "Stray cattle blocking road near Narengi",
      status: "submitted",
      upvotes: 45,
      downvotes: 8,
      comments: [
        { id: 1, comment: "Traffic jam due to cows." }
      ],
      image: "https://www.hindustantimes.com/ht-img/img/2023/09/20/1600x900/gege_akutami_1695225795670_1695225816461.jpg"
    },
    {
      name: "Pooja Sen",
      post_time: "1 min ago",
      report_title: "Garbage scattered near GS Road",
      status: "submitted",
      upvotes: 36,
      downvotes: 7,
      comments: [
        { id: 1, comment: "Roadside vendors dumping trash." }
      ],
      image: "https://www.hindustantimes.com/ht-img/img/2023/09/20/1600x900/gege_akutami_1695225795670_1695225816461.jpg"
    },
    {
      name: "Vikram Thakur",
      post_time: "9 hours ago",
      report_title: "Noise pollution due to loudspeakers at Bharalumukh",
      status: "acknowledged",
      upvotes: 49,
      downvotes: 21,
      comments: [
        { id: 1, comment: "Can’t sleep at night." }
      ],
      image: "https://www.hindustantimes.com/ht-img/img/2023/09/20/1600x900/gege_akutami_1695225795670_1695225816461.jpg"
    },
    {
      name: "Shweta Paul",
      post_time: "4 hours ago",
      report_title: "Uncovered drains near Lokhra",
      status: "inprogress",
      upvotes: 62,
      downvotes: 16,
      comments: [
        { id: 1, comment: "Kids almost fell here." }
      ],
      image: "https://www.hindustantimes.com/ht-img/img/2023/09/20/1600x900/gege_akutami_1695225795670_1695225816461.jpg"
    }
  ])

  const navigate = useNavigate();

  function handlePageChange(change) {
    if(change == 'prev' && pageNumber == 1) {
      return
    }
    else if(change == 'prev') {
      setPageNumber(pageNumber - 1)
      // navigate(`${pageNumber - 1}`)
    }
    else if(change == 'next') {
      setPageNumber(pageNumber + 1)
      // navigate(`${pageNumber + 1}`)
    }
    else if(parseInt(change)) {
      setPageNumber(parseInt(change))
      // navigate(`${parseInt(change)}`)
    }

  }

  return (
    <div className='homepage-container'>
      <Navbar />
      <Stats />
      <h1 id='community-reports-title'>Community Reports</h1>
      <div className='reports-grid'>
        {reports.map((report, idx) => {
          return(
            <SmallReport
            key={report.name + report.post_time + idx} 
            username={report.name} 
            post_time={report.post_time} 
            report_title={report.report_title}
            downvotes={report.downvotes}
            upvotes={report.upvotes}
            comments={report.comments}
            status={report.status}
            image_url={report.image}
            />
          )
        })}
      </div>

      <div className='pagination-container'>
        <button onClick={() => handlePageChange('prev')}>{'<'}</button>
        <button className='active' onClick={() => handlePageChange(String(pageNumber))}>{pageNumber}</button>
        <button onClick={() => handlePageChange(String(pageNumber + 1))}>{pageNumber + 1}</button>
        <button onClick={() => handlePageChange(String(pageNumber + 2))}>{pageNumber + 2}</button>
        <button onClick={() => handlePageChange('next')}>{'>'}</button>
      </div>
    </div>
  )
}

export default Homepage
