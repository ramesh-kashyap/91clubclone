import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

export default function Loader() {
  return (
    <div className="spinner-container" style={{ position:'absolute',top:'50%',left:'50%' }}>
    <ThreeDots
visible={true}
height="80"
width="80"
color="#f95959"
radius="9"
ariaLabel="three-dots-loading"
wrapperStyle={{}}
wrapperClass=""
/>
  </div>
  )
}
