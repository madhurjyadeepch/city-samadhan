import React from 'react'
import './SmallReport.css'
import upvote from '../assets/upvote.png'
import upvote_filled from '../assets/upvote_filled.png'
import commenticon from '../assets/commenticon.png'

const SmallReport = (props) => {   
    const [upvotes, setUpvotes] = React.useState(0)
    const [downvotes, setDownvotes] = React.useState(0)

    const [upvoted, setUpvoted] = React.useState(false)
    const [downvoted, setDownvoted] = React.useState(false)

    function handleUpvote() {
        if(upvoted == true && downvoted == false) {
            setUpvotes(upvotes - 1)
            setUpvoted(upvoted => !upvoted)
        }
        else if(upvoted == false && downvoted == true){
            setUpvotes(upvotes + 1)
            setUpvoted(upvoted => !upvoted)
            setDownvotes(downvotes - 1)
            setDownvoted(downvoted => !downvoted)
        }
        else {
            setUpvotes(upvotes + 1)
            setUpvoted(upvoted => !upvoted)
        }
    }

    function handleDownvote() {
        if(downvoted == true && upvoted == false) {
            setDownvotes(downvotes - 1)
            setDownvoted(downvoted => !downvoted)
        }
        else if(downvoted == false && upvoted == true) {
            setDownvotes(downvotes + 1)
            setDownvoted(downvoted => !downvoted)
            setUpvotes(upvotes - 1)
            setUpvoted(upvoted => !upvoted)
        }
        else {
            setDownvotes(downvotes + 1)
            setDownvoted(downvoted => !downvoted)
        }
    }

  return (
    <div className='small-report-container'>
        <div className='user-info-container'>
            <div className='user-info'>
                <img class='user-profile-picture'src='https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'/>
                <p class='username'>{props.username}</p>
                <p class='post-time'>{props.post_time}</p>
            </div>
            <div className='status-dropdown-box'>
                <select name='status' id='status' defaultValue={props.status}>
                    <option value='submitted'>Submitted</option>
                    <option value='acknowledged'>Acknowledged</option>
                    <option value='inprogress'>In-Progress</option>
                    <option value='resolved'>Resolved</option>
                </select>
            </div>
        </div>
        <div className='main-content'>
            <h1 className='small-container-report-title'>{props.report_title}</h1>
            <div className='bottom-section'> 
                <div className='report-image-wrapper'>
                    <img  id='user-image' src={props.image_url}/>
                </div>
                <div className='user-interactions'>
                    <span onClick={handleUpvote}>
                        <img src={upvoted ? upvote_filled : upvote}/>
                        <p>{upvotes}</p>
                    </span>
        
                    <span onClick={handleDownvote}>
                        <img src={downvoted ? upvote_filled : upvote} id='downvote'/>
                        <p>{downvotes}</p>
                    </span>
                    
                    <span><img src={commenticon}/><p>{props.comments.length}</p></span>
                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default SmallReport
