import React from 'react'
import { useParams } from 'react-router-dom'


const LiveStreamPage = () => {
    const {id} = useParams();
    return (
    <div>LiveStreamPage {id}</div>
  )
}

export default LiveStreamPage