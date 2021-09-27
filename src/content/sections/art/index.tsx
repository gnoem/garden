import React from "react";

const title = 'art';

const content = () => {
  return (
    <>
      <h2>art</h2>
      <div style={{
        width: '250px',
        maxWidth: '100%',
        fontSize: '0'
      }}>
        <img src="https://i.imgur.com/MFZ0A2w.png" style={{ width: '100%', height: 'auto' }} alt="portrait of chester the cheetah, 2021" />
      </div>
    </>
  )
}

export const art = {
  title,
  content
}