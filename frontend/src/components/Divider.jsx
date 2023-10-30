import React from 'react'
import { ReactSVG } from "react-svg";
import dividerSVG from '../assets/divider.svg'

function Divider() {
  return (
    <div className='svg-adjust'>
    <ReactSVG src={dividerSVG} />
    </div>
  )
}

export default Divider