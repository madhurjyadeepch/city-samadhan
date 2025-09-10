import React from 'react'
import './SmallReport.css'

const SmallReport = (props) => {
  return (
    <div className='small-report-container'>
        <div className='user-info-container'>
            <div className='user-info'>
                <img id='user-profile-picture'src='https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'/>
                <p id='username'>{props.username}</p>
                <p id='post-time'>{props.post_time}</p>
            </div>
            <div className='status-dropdown-box'>
                <select name='status' id='status'>
                    <option value='submitted'>Submitted</option>
                    <option value='acknowledged'>Acknowledged</option>
                    <option value='inprogress'>In-Progress</option>
                    <option value='resolved'>Resolved</option>
                </select>
            </div>
        </div>
        <div className='main-content'>
            <h1 className='small-container-report-title'>{props.report_title}</h1>
            <div className='report-image-wrapper'>
                <img  id='user-image' src='https://www.houselogic.com/wp-content/uploads/2011/09/flood-waters-around-blue-house-standard_8150b0462cc3bcfa6cbffd185f828669.jpg?crop&resize=2048%2C1365&quality=80'/>
            </div>
            <div className='user-interactions'>
                <span class="material-symbols-outlined">thumb_up</span>
                <span class="material-symbols-outlined">thumb_down</span>
                <span class="material-symbols-outlined">comment</span>
            </div>
        </div>
        
    </div>
  )
}

export default SmallReport
